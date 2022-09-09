import { defineConfig } from "tsup";

export default defineConfig((options) => {
  if (!(options.entry instanceof Array)) return {};
  if (options.entry[0] === "src/cli.ts")
    return {
      inject: ["./shim.js"],
    };
  else if (options.entry[0] === "index.ts")
    return {
      outDir: "./action",
    };
  return {};
});
