export default {
  help: { type: "boolean", default: false, alias: "h" },
  version: { type: "boolean", default: false, alias: "v" },
  groupId: { type: "number", alias: "g" },
  accountId: { type: "string", alias: "acc" },
  token: { type: "string", alias: "t" },
  directory: { type: "string", alias: "dir" },
  outDir: { type: "string", alias: "out", default: ".checkly" },
  prebuilt: { type: "boolean", default: false },
  recursive: { type: "boolean", default: true },
} as const;
