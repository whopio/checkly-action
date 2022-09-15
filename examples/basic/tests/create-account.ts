import { InferContext } from "@whop-sdk/checkly-action";
import type before from "./_before";

export const config = {
  description: "should be able to log in",
  tags: [],
  activated: true,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async (ctx: InferContext<typeof before>) => {
  await ctx.page.goto("https://google.com");
};
