import type before from "./_before";
import type { InferContext } from "@whop-sdk/checkly-action";

export const config = {
  description: "should be able to log in",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async (ctx: InferContext<typeof before>) => {
  await ctx.page.goto("https://google.com");
};
