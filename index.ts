import { getInput } from "@actions/core";
import { exec } from "@actions/exec";
import { name, version } from "./package.json";

const CHECKLY_ACTION_BIN = `${name}@${version}`;
const token = getInput("checkly-token");
const group = getInput("checkly-group");
const account = getInput("checkly-account");
const directory = getInput("directory");

const s3Key = getInput("s3-key");
const s3Keyid = getInput("s3-key-id");
const s3Bucket = getInput("s3-bucket");
const s3Endpoint = getInput("s3-endpoint");
const s3Region = getInput("s3-region");
const maxScriptSize = getInput("max-script-size");

const optional = (flag: string, value: string) => (value ? [flag, value] : []);

const command = [
  CHECKLY_ACTION_BIN,
  "deploy",
  ...["-t", token],
  ...["--acc", account],
  ...["-g", group],
  ...["--dir", directory],
  ...optional("--s3Key", s3Key),
  ...optional("--s3KeyId", s3Keyid),
  ...optional("--s3Endpoint", s3Endpoint),
  ...optional("--s3Bucket", s3Bucket),
  ...optional("--s3Region", s3Region),
  ...optional("--maxRawScriptSize", maxScriptSize),
];

exec("npx", command);
