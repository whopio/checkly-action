import { defineConfig } from "tsup";

export default defineConfig((options) => {
  if (!(options.entry instanceof Array)) return {};
  if (options.entry[0] === "src/cli.ts")
    return {
      banner: {
        js: `
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
        `,
      },
    };
  else if (options.entry[0] === "index.ts")
    return {
      outDir: "./action",
    };
  return {};
});
