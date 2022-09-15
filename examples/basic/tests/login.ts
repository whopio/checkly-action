import { chromium } from "playwright";

// TODO: set activated to false
export const config = {
  description: "should be able to log in",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: true,
  locations: [],
};

export default async () => {
  throw new Error("test error");
};
