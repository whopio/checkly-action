import { exec as _exec, ExecException } from "child_process";
import { readdir, readJSON, stat } from "fs-extra";
import { TypedFlags } from "meow";
import { dirname, join, parse, relative } from "path";
import { promisify } from "util";
import flags from "../flags";
import { FullChecklyConfig } from "../types";
import { collectLocalTests } from "../util/common";
import minimatch from "minimatch";

const exec = promisify(_exec);

type TestCollection = {
  name: string;
  files: string[];
  folders: TestCollection[];
};

const collectTests = async (
  dir: string,
  filter: string[] | undefined,
  baseDir: string = dir
): Promise<TestCollection> => {
  const collection: TestCollection = {
    name: dir,
    files: [],
    folders: [],
  };
  const filesAndFolders = await readdir(dir);
  for (const fileOrFolder of filesAndFolders) {
    const full = join(dir, fileOrFolder);
    if ((await stat(full)).isDirectory())
      collection.folders.push(await collectTests(full, filter, baseDir));
    else {
      if (filter && filter.length) {
        let matched = false;
        for (const singleFilter of filter) {
          if (minimatch(dirname(relative(baseDir, full)), singleFilter)) {
            matched = true;
            break;
          }
        }
        if (matched) collection.files.push(full);
      } else collection.files.push(full);
    }
  }
  return collection;
};

const run = async ({
  outDir,
  directory,
  filter,
  verbose,
}: TypedFlags<typeof flags>) => {
  if (!directory) return;
  const testsDirectory = join(directory, outDir);
  const tests2 = await collectTests(testsDirectory, filter);
  console.log(
    `Running ${tests2.folders.length} Task${
      tests2.folders.length !== 1 ? "s" : ""
    }`
  );
  const start = Date.now();
  const { success, total } = await runCollection(
    testsDirectory,
    tests2,
    verbose,
    "",
    filter
  );
  console.log(
    `Done in ${Date.now() - start}ms: ${success}/${total} Tests passed`
  );
};

const runCollection = async (
  baseDir: string,
  collection: TestCollection,
  verbose: boolean,
  prefix: string,
  filter?: string[],
  result: { success: number; total: number } = {
    success: 0,
    total: 0,
  }
) => {
  if (collection.files.find((item) => item.endsWith("/config.json"))) {
    result.total++;
    if (await runTest(collection.name, verbose, prefix)) {
      result.success++;
    }
  }

  if (collection.folders.length) {
    const name = relative(baseDir, collection.name);
    if (name)
      console.log(
        `${prefix}Sub-Task (${relative(baseDir, collection.name)}) with ${
          collection.folders.length
        } Task${collection.folders.length !== 1 ? "s" : ""}`
      );
    const start = Date.now();
    for (const folder of collection.folders) {
      await runCollection(
        baseDir,
        folder,
        verbose,
        prefix ? prefix + "| " : " | ",
        filter,
        result
      );
    }
    if (name)
      console.log(
        `${prefix}Sub-Task (${relative(baseDir, collection.name)}) done in ${
          Date.now() - start
        }ms`
      );
  }

  return result;
};

const runTest = async (dir: string, verbose: boolean, prefix: string) => {
  const { name } = parse(dir);
  const { activated, shouldFail } = (await readJSON(
    join(dir, "config.json")
  )) as FullChecklyConfig;
  let result: boolean;
  if (activated) {
    let error: string | Error = "";
    process.stdout.write(`${prefix}Task (${name}) running`);
    const start = Date.now();
    try {
      await exec(`node ./${join(dir, "script.js")}`);
      if (shouldFail) {
        result = false;
        error = "Expected test to fail but test succeeded";
      } else result = true;
    } catch (e) {
      if (shouldFail) result = true;
      else {
        result = false;
        error = e instanceof Error ? e : "Unknown Error";
      }
    }
    const duration = Date.now() - start;
    process.stdout.clearLine && process.stdout.clearLine(0);
    process.stdout.cursorTo
      ? process.stdout.cursorTo(0)
      : process.stdout.write("\n");
    if (result) {
      process.stdout.write(`${prefix}Task (${name}) success in ${duration}ms`);
      process.stdout.write("\n");
    } else {
      process.stdout.write(`${prefix}Task (${name}) failure in ${duration}ms`);
      process.stdout.write("\n");
      if (verbose)
        console.log(
          parseError(error)
            .split("\n")
            .map((part) => `${prefix}| ${part}`)
            .join("\n")
        );
    }
    return result;
  }
  console.log(`${prefix}Task (${name}) skipped`);
  return true;
};

interface ActualExecException extends ExecException {
  stdout: string;
  stderr: string;
}

const isExecException = (e: any): e is ActualExecException => {
  return e instanceof Error && "stderr" in e;
};

const parseError = (e: any) => {
  if (isExecException(e)) {
    const [, ...messageParts] = e.message.split("\n").reverse();
    const message = [];
    for (const part of messageParts) {
      message.push(part);
      if (part.charAt(0) !== " ") break;
    }
    return message.reverse().join("\n");
  }
  return "Unknown Error";
};

export default run;
