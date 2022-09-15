import { createHash } from "crypto";
import { readFile } from "fs-extra";
import { join, parse } from "path";
import { makeESBuildPlugin } from "./esbuild-plugin";

const LoaderEntry = (b64: string, ext: string) => `
import { join } from "path";
import { promises } from "fs";
const { writeFile, unlink } = promises;

const fileName = join(process.cwd(), "tmp-${createHash("sha1")
  .update(b64)
  .digest("hex")}${ext}");

export const release = async () => {
  try {
    await unlink(fileName);
  } catch {}
}

let singleton;

const getFilename = async () => {
  await writeFile(fileName, "${b64}", { encoding: "base64" });
  return fileName;
}

export default async () => {
  return singleton || (singleton = getFilename());
}
`;

const BinaryLoader = (filter: RegExp, dir: string) => {
  return makeESBuildPlugin("BinaryLoader", (build) => {
    build.onResolve({ filter }, async (args) => {
      return {
        namespace: "binary",
        path: args.path,
      };
    });
    build.onLoad({ filter: /.*/, namespace: "binary" }, async (args) => {
      const data = (await readFile(join(dir, args.path))).toString("base64");
      const { ext } = parse(args.path);
      return {
        contents: LoaderEntry(data, ext),
        loader: "js",
      };
    });
  });
};

export default BinaryLoader;
