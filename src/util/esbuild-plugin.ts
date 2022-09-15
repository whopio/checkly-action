import { Plugin, PluginBuild } from "esbuild";

export const makeESBuildPlugin = (
  name: string,
  buildHook: (build: PluginBuild) => any
): Plugin => ({
  name,
  setup(build) {
    return buildHook(build);
  },
});
