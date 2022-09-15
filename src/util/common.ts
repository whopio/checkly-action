import { readdir, stat, Stats } from "fs-extra";
import { join } from "path";

export const exists = async (
  location: string,
  check?: (stats: Stats) => boolean
) => {
  try {
    const stats = await stat(location);
    if (check) return check(stats);
    return true;
  } catch {
    return false;
  }
};

export const collectLocalTests = async (
  dir: string,
  result: Set<string> = new Set()
) => {
  if (!(await exists(dir, (stats) => stats.isDirectory()))) return result;
  const filesAndFolders = await readdir(dir);
  await Promise.all(
    filesAndFolders.map(async (fileOrFolder) => {
      const full = join(dir, fileOrFolder);
      if ((await stat(full)).isDirectory())
        await collectLocalTests(full, result);
      else {
        if (fileOrFolder === "config.json") result.add(dir);
      }
    })
  );
  return result;
};
