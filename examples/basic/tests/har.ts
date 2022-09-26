import { InferContext } from "@whop-sdk/checkly-action";
import { routeFromHAR } from "@whop-sdk/checkly-helpers";
import archive from "./test.har";
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
  await routeFromHAR(page, archive);
};
