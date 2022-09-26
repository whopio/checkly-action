import { InferContext } from "@whop-sdk/checkly-action";
import type _before from "./_before";

// TODO: set activated to false
export const config = {
  description: "should be able to log in",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: true,
  locations: [],
  on: "firefox",
};

export default async ({ page }: InferContext<typeof _before>) => {
  throw new Error("test error.");
};
