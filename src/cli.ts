#!/usr/bin/env node

import S3 from "aws-sdk/clients/s3";
import { createHash } from "crypto";
import { build as esbuild } from "esbuild";
import {
  outputFile,
  outputJSON,
  readdir,
  readFile,
  readJSON,
  readJson,
  rm,
  stat,
} from "fs-extra";
import meow, { TypedFlags } from "meow";
import Module, { builtinModules } from "module";
import { dirname, join, relative } from "path";
import { runInNewContext } from "vm";
import { CheckGroupCheck, CheckGroupsApi, ChecksApi } from "./checkly/api";
import run from "./commands/run";
import { CHECKLY_MAX_SCRIPT_LENGTH } from "./constants";
import flags from "./flags";
import { ChecklyConfig, FullChecklyConfig, TestingHooks } from "./types";
import BinaryLoader from "./util/binary-loader";
import { collectLocalTests, exists } from "./util/common";
import { makeExportStripper } from "./util/export-stripper";

const help = `
Get help brother
`;

const makeHandlerEntry = (
  path: string,
  on: ChecklyConfig["on"],
  hooks: TestingHooks
) => `
import handler from "test:./${path}";
import { ${on} } from "playwright";

const _before = [${hooks.before.map((hook) => `import("./${hook}")`)}];
const _after = [${hooks.after.map((hook) => `import("./${hook}")`)}];

(async () => {
  const browser = await ${on}.launch({ headless: !process.argv.includes("--head") });
  let ctx = {
    browser,
    context: await browser.newContext()
  };
  for (const before of _before) ctx = await (await before).default(ctx);
  await handler(ctx);
  for (const after of _after) await (await after).default(ctx);
})();
`;

const makeConfigEntry = (path: string) => `
import { config } from "config:./${path}";

export default config;
`;

const wrapScript = (path: string, script: string) => `
// auto-generated file, do not edit. Source at: ${path}
${script}
`;

const HandlerPlugin = makeExportStripper("HandlerPlugin", /^test:/, [], true);
const ConfigPlugin = makeExportStripper(
  "ConfigPlugin",
  /^config:/,
  ["config"],
  false
);

const build = async ({ directory, outDir }: TypedFlags<typeof flags>) => {
  process.stdout.write("building...");
  const start = Date.now();
  const baseDir = directory ? join(process.cwd(), directory) : process.cwd();
  let baseConfig: ChecklyConfig = {
    locations: [],
    runtimeId: "",
    frequency: 10,
    on: "chromium",
  };
  try {
    await rm(join(baseDir, outDir), { recursive: true });
  } catch {}
  try {
    baseConfig = {
      ...baseConfig,
      ...(await readJson(join(baseDir, "checkly.config.json"))),
    };
  } catch {}
  const collect = async (dir: string, result: string[] = []) => {
    const filesAndFolders = await readdir(join(baseDir, dir));
    for (const fileOrFolder of filesAndFolders) {
      const full = join(dir, fileOrFolder);
      if ((await stat(join(baseDir, full))).isDirectory()) {
        await collect(full, result);
      } else if (full.endsWith(".ts") || full.endsWith(".js")) {
        if (!fileOrFolder.startsWith("_")) result.push(full);
      }
    }
    return result;
  };
  if (!(await exists(join(baseDir, "tests"), (stats) => stats.isDirectory())))
    return;
  const tests = await collect("tests");
  await Promise.all(
    tests.map((test) => buildSingle(baseDir, outDir, baseConfig, test))
  );
  process.stdout.clearLine && process.stdout.clearLine(0);
  process.stdout.cursorTo
    ? process.stdout.cursorTo(0)
    : process.stdout.write("\n");
  process.stdout.write(`Build done in ${Date.now() - start}ms`);
  process.stdout.write("\n");
};

const buildSingle = async (
  baseDir: string,
  outBase: string,
  baseConfig: ChecklyConfig,
  entry: string
) => {
  const config = await buildConfig(baseDir, baseConfig, entry);
  const script = await buildScript(baseDir, entry, config.on);
  const outDir = join(
    baseDir,
    outBase,
    entry
      .replace(/\.ts$/, "")
      .replace(/\.js$/, "")
      .replace(/tests\//, "")
  );
  await outputJSON(join(outDir, "config.json"), config);
  await outputFile(
    join(outDir, "script.js"),
    wrapScript(entry, script).trim() + "\n"
  );
};

const findHooks = async (
  baseDir: string,
  entry: string
): Promise<TestingHooks> => {
  const folders = dirname(entry).split("/");
  const before: string[] = [];
  const after: string[] = [];
  for (const idx in folders) {
    const path = folders.slice(0, parseInt(idx) + 1).join("/");
    if (
      await exists(join(baseDir, path, "_before.ts"), (stats) => stats.isFile())
    )
      before.push(join(relative(baseDir, join(baseDir, path, "_before.ts"))));
    else if (
      await exists(join(baseDir, path, "_before.js"), (stats) => stats.isFile())
    )
      before.push(join(relative(baseDir, join(baseDir, path, "_before.js"))));
    if (
      await exists(join(baseDir, path, "_after.ts"), (stats) => stats.isFile())
    )
      after.push(join(relative(baseDir, join(baseDir, path, "_after.ts"))));
    else if (
      await exists(join(baseDir, path, "_after.js"), (stats) => stats.isFile())
    )
      after.push(join(relative(baseDir, join(baseDir, path, "_after.js"))));
  }
  return {
    before,
    after: after.reverse(),
  };
};

const buildScript = async (
  baseDir: string,
  entry: string,
  on: ChecklyConfig["on"]
) => {
  const hooks = await findHooks(baseDir, entry);
  const handlerEntry = makeHandlerEntry(entry, on, hooks);
  const {
    outputFiles: [{ text }],
  } = await esbuild({
    stdin: {
      contents: handlerEntry,
      loader: "ts",
      resolveDir: baseDir,
    },
    absWorkingDir: baseDir,
    write: false,
    format: "cjs",
    external: [...builtinModules, "playwright", "expect", "puppeteer"],
    plugins: [BinaryLoader(/.\/.*.(har|json)$/), HandlerPlugin(baseDir)],
    target: "node16",
    bundle: true,
    minify: true,
  });
  return text;
};

const buildConfig = async (
  baseDir: string,
  baseConfig: ChecklyConfig,
  entry: string
) => {
  try {
    const configEntry = makeConfigEntry(entry);
    const {
      outputFiles: [{ text }],
    } = await esbuild({
      stdin: {
        contents: configEntry,
        loader: "ts",
        resolveDir: baseDir,
      },
      absWorkingDir: baseDir,
      write: false,
      format: "cjs",
      external: [...builtinModules],
      plugins: [BinaryLoader(/.\/.*.(har|json)$/), ConfigPlugin(baseDir)],
      target: "node16",
      bundle: true,
    });
    const { default: testConfig } = runScript<{ default: FullChecklyConfig }>(
      text,
      join(baseDir, entry)
    );
    return { ...baseConfig, ...testConfig };
  } catch {
    return baseConfig;
  }
};

const readLocalTest =
  (baseDir: string, bucket: string, region: string, maxSize: number, s3?: S3) =>
  async (location: string) => {
    const [config, script] = await Promise.all([
      readJSON(join(location, "config.json")),
      readFile(join(location, "script.js"), { encoding: "utf-8" }),
    ]);
    return {
      config: config as FullChecklyConfig,
      script:
        script.length >= maxSize
          ? await makeRemoteScript(s3, bucket, region, script, baseDir)
          : script,
      location: relative(baseDir, location),
    };
  };

const getAllChecks = async (
  api: CheckGroupsApi,
  group: number,
  account: string
): Promise<CheckGroupCheck[]> => {
  const {
    body: all,
    response: {
      headers: { "content-range": range },
    },
  } = await api.getV1CheckgroupsIdChecks(group, account, 100);
  const [, total] = range!.split("/");
  const more = await Promise.all(
    Array(Math.max(0, Math.ceil(parseInt(total) / 100) - 1))
      .fill(true)
      .map(async (_, page) => {
        const { body: more } = await api.getV1CheckgroupsIdChecks(
          group,
          account,
          100,
          page + 2
        );
        return more;
      })
  );
  all.push(...more.flat());
  return all;
};

const remoteScriptEntry = ({ url, hash }: { url: string; hash: string }) => `
import { request } from "playwright";
import { createHash } from "crypto";
import { promises } from "fs";
const { writeFile } = promises;

const downloadScript = async (url: string, hash: string) => {
  const client = await request.newContext();
  const res = await client.get(url);
  if (!(res.ok())) throw new Error("DownloadError: " + res.statusText);
  const body = await res.body();
  if (createHash("sha256").update(body).digest("hex") !== hash) throw new Error("DownloadError: Hash mismatch");
  const key = "./" + hash + ".js";
  await writeFile(key, body);
  return key;
}

(async () => {
  const src = await downloadScript("${url}", "${hash}");
  require(src);
})();
`;

const makeRemoteScript = async (
  s3: S3 | undefined,
  bucket: string,
  region: string,
  source: string,
  baseDir: string
): Promise<string> => {
  if (!s3)
    throw new Error("S3 Config has to be provided for remote script loading");
  const hash = createHash("sha256").update(source).digest("hex");
  const Key = hash + ".js";
  const match =
    /^\/\/ auto-generated file, do not edit\. Source at: (.*)$/gm.exec(
      source
    )?.[1];
  if (!match) throw new Error("Unable to find source location.");
  try {
    await s3.headBucket({ Bucket: bucket }).promise();
  } catch {
    await s3.createBucket({ Bucket: bucket }).promise();
  }
  try {
    await s3.headObject({ Bucket: bucket, Key }).promise();
  } catch {
    await s3.putObject({ Bucket: bucket, Key, Body: source }).promise();
  }
  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: bucket,
    Key,
    Expires: 3600 * 24 * 30 * 12,
  });
  const {
    outputFiles: [{ text }],
  } = await esbuild({
    bundle: true,
    // TODO: this is wrong, checkly only exposes a very small set of internal modules
    external: [...builtinModules, "playwright"],
    format: "cjs",
    minify: true,
    write: false,
    stdin: {
      contents: remoteScriptEntry({ url: signedUrl, hash }),
      loader: "ts",
      resolveDir: join(process.cwd(), baseDir),
    },
    absWorkingDir: join(process.cwd(), baseDir),
    target: "node16",
  });
  return wrapScript(match, text);
};

const deploy = async ({
  directory,
  outDir,
  token,
  groupId,
  accountId,
  s3Key,
  s3KeyId,
  s3Bucket,
  s3Endpoint,
  s3Region,
  maxRawScriptSize,
}: TypedFlags<typeof flags>) => {
  if (!groupId || !directory || !accountId) throw new Error("");
  const s3 =
    s3Key && s3KeyId
      ? new S3({
          credentials: { accessKeyId: s3KeyId, secretAccessKey: s3Key },
          endpoint: s3Endpoint,
          region: s3Region,
        })
      : undefined;
  const groupsApi = new CheckGroupsApi();
  groupsApi.defaultHeaders = {
    Authorization: "Bearer " + token,
  };
  const checksApi = new ChecksApi();
  checksApi.defaultHeaders = {
    Authorization: "Bearer " + token,
  };
  const checks = (await getAllChecks(groupsApi, groupId, accountId)).filter(
    (check) => check.checkType === CheckGroupCheck.CheckTypeEnum.Browser
  );
  const localTestLocations = await collectLocalTests(join(directory, outDir));
  const localTestReader = readLocalTest(
    join(directory, outDir),
    s3Bucket,
    s3Region,
    Math.min(CHECKLY_MAX_SCRIPT_LENGTH, maxRawScriptSize),
    s3
  );
  const localTests = await Promise.all(
    Array.from(localTestLocations).map(localTestReader)
  );
  const matchedChecks: string[] = [];
  for (const localTest of localTests) {
    const match = checks.find((check) => check.name === localTest.location);
    if (match) {
      matchedChecks.push(match.id!);
      // check if update is needed
      let updateNeeded = false;
      if (match.activated !== localTest.config.activated) updateNeeded = true;
      if (match.muted !== localTest.config.muted) updateNeeded = true;
      if (match.doubleCheck !== localTest.config.doubleCheck)
        updateNeeded = true;
      if (match.shouldFail !== localTest.config.shouldFail) updateNeeded = true;
      if (match.script !== localTest.script) updateNeeded = true;
      if (updateNeeded) {
        console.info("Updating:", localTest.location, match.id);
        await checksApi.putV1ChecksBrowserId(match.id!, accountId, true, {
          activated: localTest.config.activated,
          muted: localTest.config.muted,
          doubleCheck: localTest.config.doubleCheck,
          shouldFail: localTest.config.shouldFail,
          script: localTest.script,
        });
      } else console.info("Skipping:", localTest.location, match.id);
    } else {
      // create check
      console.info("Creating:", localTest.location);
      await checksApi.postV1ChecksBrowser(accountId, true, {
        name: localTest.location,
        activated: localTest.config.activated,
        muted: localTest.config.muted,
        doubleCheck: localTest.config.doubleCheck,
        shouldFail: localTest.config.shouldFail,
        script: localTest.script,
        groupId,
      });
    }
  }
  const unmatched = checks
    .filter((check) => !matchedChecks.includes(check.id!))
    .map((check) => check.id);
  for (const obsolete of unmatched) {
    if (!obsolete) return;
    console.info("Removing:", obsolete);
    await checksApi.deleteV1ChecksId(obsolete, {
      headers: { "x-checkly-account": accountId },
    });
  }
};

type WrappedModule<T = unknown> = (
  exports: any,
  req: typeof require,
  module: any,
  __filename: string,
  __dirnaname: string
) => T;

const runScript = <T = unknown>(src: string, location: string): T => {
  const wrapped = Module.wrap(src);
  const mod = { exports: {} };
  const script: WrappedModule = runInNewContext(wrapped, global);
  script(mod.exports, require, mod, location, dirname(location));
  return mod.exports as T;
};

const main = async () => {
  const {
    input: [command, ...rest],
    flags: inputFlags,
    showHelp,
    showVersion,
  } = meow(help, {
    booleanDefault: undefined,
    importMeta: import.meta,
    flags,
  });
  if (inputFlags.help) showHelp();
  if (inputFlags.version) showVersion();

  switch (command) {
    case "build":
      return build(inputFlags);
    case "deploy":
      if (!inputFlags.prebuilt) await build(inputFlags);
      return deploy(inputFlags);
    case "run":
      if (!inputFlags.prebuilt) await build(inputFlags);
      return run(inputFlags);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

main();
