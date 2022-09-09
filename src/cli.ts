#!/usr/bin/env node

import meow, { TypedFlags } from "meow";
import { dirname, join, relative } from "path";
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
import { makeExportStripper } from "./util/export-stripper";
import { build as esbuild } from "esbuild";
import Module, { builtinModules } from "module";
import { runInNewContext } from "vm";
import { CheckGroupCheck, CheckGroupsApi, ChecksApi } from "./checkly/api";

const help = `
Get help brother
`;

interface ChecklyConfig {
  locations: string[];
  runtimeId: string;
  frequency: number;
}

type FullChecklyConfig = ChecklyConfig & {
  activated: boolean;
  muted: boolean;
  shouldFail: boolean;
  doubleCheck: boolean;
};

const makeHandlerEntry = (path: string) => `
import handler from "test:./${path}";

handler();
`;

const makeConfigEntry = (path: string) => `
import { config } from "config:./${path}";

export default config;
`;

const wrapScript = (path: string, script: string) => `
// auto-generated file, do not edit. Source at: ${path}
${script}
`;

const meowFlags = {
  help: { type: "boolean", default: false, alias: "h" },
  version: { type: "boolean", default: false, alias: "v" },
  groupId: { type: "number", alias: "g" },
  accountId: { type: "string", alias: "acc" },
  token: { type: "string", alias: "t" },
  directory: { type: "string", alias: "dir" },
  outDir: { type: "string", alias: "out", default: ".checkly" },
  prebuilt: { type: "boolean", default: false },
} as const;

const HandlerPlugin = makeExportStripper("HandlerPlugin", /^test:/, [], true);
const ConfigPlugin = makeExportStripper(
  "ConfigPlugin",
  /^config:/,
  ["config"],
  false
);

const build = async ({ directory, outDir }: TypedFlags<typeof meowFlags>) => {
  const baseDir = directory ? join(process.cwd(), directory) : process.cwd();
  let baseConfig: ChecklyConfig = {
    locations: [],
    runtimeId: "",
    frequency: 10,
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
  const tests = await collect("tests");
  await Promise.all(
    tests.map((test) => buildSingle(baseDir, outDir, baseConfig, test))
  );
};

const buildSingle = async (
  baseDir: string,
  outBase: string,
  baseConfig: ChecklyConfig,
  entry: string
) => {
  const [config, script] = await Promise.all([
    buildConfig(baseDir, baseConfig, entry),
    buildScript(baseDir, outBase, baseConfig, entry),
  ]);
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
  outBase: string,
  baseConfig: ChecklyConfig,
  entry: string
) => {
  const handlerEntry = makeHandlerEntry(entry);
  const {
    outputFiles: [{ path, text }],
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
      outputFiles: [{ path, text }],
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
    const { default: testConfig } = runScript<{ default: any }>(
      text,
      join(baseDir, entry)
    );
    return { ...baseConfig, ...testConfig };
  } catch {
    return baseConfig;
  }
};

const collectLocalTests = async (
  dir: string,
  result: Set<string> = new Set()
) => {
  const filesAndFolders = await readdir(dir);
  for (const fileOrFolder of filesAndFolders) {
    const full = join(dir, fileOrFolder);
    if ((await stat(full)).isDirectory()) await collectLocalTests(full, result);
    else {
      if (full.endsWith("config.json")) result.add(dir);
    }
  }
  return result;
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
  const all = [];
  const {
    body,
    response: {
      headers: { "content-range": range },
    },
  } = await api.getV1CheckgroupsIdChecks(group, account);
  all.push(...body);
  const [, total] = range!.split("/");
  const more = await Promise.all(
    Array(Math.max(0, Math.ceil(parseInt(total) / 100) - 1))
      .fill(true)
      .map(async (_, page) => {
        const { body: more } = await api.getV1CheckgroupsIdChecks(
          group,
          account
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
}: TypedFlags<typeof meowFlags>) => {
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
    flags,
    showHelp,
    showVersion,
  } = meow(help, {
    booleanDefault: undefined,
    importMeta: import.meta,
    flags: meowFlags,
  });

  if (flags.help) showHelp();
  if (flags.version) showVersion();

  switch (command) {
    case "build":
      return build(flags);
    case "deploy":
      if (!flags.prebuilt) await build(flags);
      return deploy(flags);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
};

main();
