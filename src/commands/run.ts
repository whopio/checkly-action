import { exec as _exec, ExecException } from "child_process";
import { readJSON } from "fs-extra";
import { TypedFlags } from "meow";
import { join, relative } from "path";
import { promisify } from "util";
import flags from "../flags";
import { FullChecklyConfig } from "../types";
import { collectLocalTests } from "../util/common";
import minimatch from "minimatch";

const exec = promisify(_exec);

const run = async ({
  outDir,
  directory,
  filter,
  verbose,
}: TypedFlags<typeof flags>) => {
  if (!directory) return;
  const testsDirectory = join(directory, outDir);
  const tests = await collectLocalTests(testsDirectory);
  if (filter && filter.length)
    for (const test of tests) {
      let matched = false;
      for (const singleFilter of filter)
        if (minimatch(relative(testsDirectory, test), singleFilter)) {
          matched = true;
          break;
        }
      if (!matched) tests.delete(test);
    }
  const total = tests.size;
  let success = 0;
  let failures = 0;
  console.log(`Running ${total} test${total !== 1 ? "s" : ""}`);
  const start = Date.now();
  for (const test of tests) {
    if (
      await runSingle(testsDirectory, relative(testsDirectory, test), verbose)
    )
      success++;
    else failures++;
  }
  console.log(
    `Done in ${Date.now() - start}ms: ${success}/${total} Tests passed`
  );
};

const runSingle = async (dir: string, name: string, verbose: boolean) => {
  const sourceDir = join(dir, name);
  const { activated, shouldFail } = (await readJSON(
    join(sourceDir, "config.json")
  )) as FullChecklyConfig;
  let result: boolean;
  if (activated) {
    let error: string | Error = "";
    process.stdout.write(` | Test (${name}) running`);
    const start = Date.now();
    try {
      await exec(`node ./${join(sourceDir, "script.js")}`);
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
    process.stdout.cursorTo(0);
    if (result) {
      process.stdout.write(` | Test (${name}) success in ${duration}ms`);
      process.stdout.write("\n");
    } else {
      process.stdout.write(` | Test (${name}) failure in ${duration}ms`);
      process.stdout.write("\n");
      if (verbose)
        console.log(
          parseError(error)
            .split("\n")
            .map((part) => ` | | ${part}`)
            .join("\n")
        );
    }
    return result;
  }
  console.log(` | Test (${name}) skipped`);
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
    const messageParts = e.message.split("\n").reverse();
    const message = [];
    for (const part of messageParts) {
      message.push(part);
      if (part.startsWith(e.name + ":")) break;
    }
    return message.reverse().join("\n");
  }
  return "Unknown Error";
};

export default run;
