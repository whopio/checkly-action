import { exec as _exec } from "child_process";
import { readJSON } from "fs-extra";
import { TypedFlags } from "meow";
import { join, relative } from "path";
import { promisify } from "util";
import flags from "../flags";
import { FullChecklyConfig } from "../types";
import { collectLocalTests } from "../util/common";
import minimatch from "minimatch";

const exec = promisify(_exec);

const run = async ({ outDir, directory, filter }: TypedFlags<typeof flags>) => {
  if (!directory) return;
  const testsDirectory = join(directory, outDir);
  const tests = await collectLocalTests(testsDirectory);
  if (filter)
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
    if (await runSingle(testsDirectory, relative(testsDirectory, test)))
      success++;
    else failures++;
  }
  console.log(
    `Done in ${Date.now() - start}ms: ${success}/${total} Tests passed`
  );
};

const runSingle = async (dir: string, name: string) => {
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
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    if (result) {
      process.stdout.write(` | Test (${name}) success in ${duration}ms`);
      process.stdout.write("\n");
    } else {
      process.stdout.write(` | Test (${name}) failure in ${duration}ms`);
      process.stdout.write("\n");
      console.log(error);
    }
    return result;
  }
  console.log(` | Test (${name}) skipped`);
  return true;
};

export default run;
