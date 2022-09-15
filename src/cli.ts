#!/usr/bin/env node

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
import flags from "./flags";
import { ChecklyConfig, FullChecklyConfig } from "./types";
import { collectLocalTests, exists } from "./util/common";
import { makeExportStripper } from "./util/export-stripper";

const help = `
Get help brother
`;

const makeHandlerEntry = (path: string, on: ChecklyConfig["on"]) => `
import handler from "test:./${path}";

export default handler();
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
      } else {
        result.push(full);
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
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
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

const buildScript = async (
  baseDir: string,
  entry: string,
  on: ChecklyConfig["on"]
) => {
  const handlerEntry = makeHandlerEntry(entry, on);
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
    plugins: [HandlerPlugin(baseDir)],
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
      plugins: [ConfigPlugin(baseDir)],
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

const readLocalTest = (baseDir: string) => async (location: string) => {
  const [config, script] = await Promise.all([
    readJSON(join(location, "config.json")),
    readFile(join(location, "script.js"), { encoding: "utf-8" }),
  ]);
  return {
    config: config as FullChecklyConfig,
    script,
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

const deploy = async ({
  directory,
  outDir,
  token,
  groupId,
  accountId,
}: TypedFlags<typeof flags>) => {
  if (!groupId || !directory || !accountId) throw new Error("");
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
  const localTests = await Promise.all(
    Array.from(localTestLocations).map(readLocalTest(join(directory, outDir)))
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
