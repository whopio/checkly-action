import { getInput } from "@actions/core";
import { exec } from "@actions/exec";

const CHECKLY_ACTION_BIN = "@whop-sdk/checkly-action@0.0.10";
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
