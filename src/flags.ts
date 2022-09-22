import { CHECKLY_MAX_SCRIPT_LENGTH } from "./constants";

export default {
  help: { type: "boolean", default: false, alias: "h" },
  version: { type: "boolean", default: false, alias: "v" },
  groupId: { type: "number", alias: "g" },
  accountId: { type: "string", alias: "acc" },
  token: { type: "string", alias: "t" },
  directory: { type: "string", alias: "dir" },
  outDir: { type: "string", alias: "out", default: ".checkly" },
  prebuilt: { type: "boolean", default: false },
  filter: { type: "string", isMultiple: true },
  verbose: { type: "boolean", default: false },
  head: { type: "boolean", default: false },
  stdout: { type: "boolean", default: false },
  s3Key: { type: "string" },
  s3KeyId: { type: "string" },
  s3Bucket: { type: "string", default: "checkly" },
  s3Endpoint: { type: "string" },
  s3Region: { type: "string", default: "us-east-1" },
  maxRawScriptSize: { type: "number", default: CHECKLY_MAX_SCRIPT_LENGTH },
} as const;
