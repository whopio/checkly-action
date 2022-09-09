import { parse, transform } from "@swc/core";
import { PluginBuild, Plugin } from "esbuild";
import { readFile } from "fs-extra";
import { dirname, join, relative } from "path";
import { stripExports } from "./ast";

export const makeESBuildPlugin = (
  name: string,
  buildHook: (build: PluginBuild) => any
): Plugin => ({
  name,
  setup(build) {
    return buildHook(build);
  },
});

const swcOptions = {
  jsc: {
    target: "es2017",
    parser: {
      syntax: "typescript",
    },
    minify: {
      compress: {
        unused: true,
      },
    },
  },
  module: {
    type: "es6",
  },
  isModule: true,
} as const;

export const makeExportStripper =
  (name: string, prefix: RegExp, whiteList: string[], defaultExport: boolean) =>
  (cwd: string) =>
    makeESBuildPlugin(name, (build) => {
      build.onResolve({ filter: prefix }, async (args) => {
        return {
          namespace: name,
          path: args.path.replace(prefix, ""),
        };
      });
      build.onLoad({ filter: /.*/, namespace: name }, async (args) => {
        const modulePath = args.path.startsWith(".")
          ? relative(process.cwd(), join(cwd, args.path))
          : args.path;
        const location = join(cwd, args.path);
        const source = await readFile(location, {
          encoding: "utf-8",
        });
        const ast = await parse(source, { syntax: "typescript" });
        const { code } = await transform(
          stripExports(ast, whiteList, defaultExport),
          swcOptions
        );
        return {
          contents: code,
          loader: "js",
          resolveDir: dirname(location),
        };
      });
    });
