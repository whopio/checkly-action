import { promises } from "fs";
const { readFile } = promises;
import fileName, { release } from "./test.har";

// TODO: set activated to false
export const config = {
  description: "should be able to log in",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async () => {
  console.log(await fileName(), (await readFile(await fileName())).toString());
  await release();
  throw new Error("test error");
};
