import { getInput } from "@actions/core";
import { exec } from "@actions/exec";
import { name, version } from "./package.json";

const CHECKLY_ACTION_BIN = `${name}@${version}`;
const token = getInput("checkly-token");
const group = getInput("checkly-group");
const account = getInput("checkly-account");
const directory = getInput("directory");

const command = [
  CHECKLY_ACTION_BIN,
  "deploy",
  ...["-t", token],
  ...["--acc", account],
  ...["-g", group],
  ...["--dir", directory],
];

exec("npx", command);
