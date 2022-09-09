const core = require("@actions/core");
const exec = require("@actions/exec");

const CHECKLY_ACTION_BIN = "@whop-sdk/checkly-actio@0.0.3";
const token = core.getInput("checkly-token");
const group = core.getInput("checkly-group");
const account = core.getInput("checkly-account");
const directory = core.getInput("directory");

const command = [
  CHECKLY_ACTION_BIN,
  "deploy",
  ...["-t", token],
  ...["--acc", account],
  ...["-g", group],
  ...["--dir", directory],
];

exec.exec("npx", command);
