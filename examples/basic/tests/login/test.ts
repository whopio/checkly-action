import type before from "./_before";
import type { InferContext, FullChecklyConfig } from "@whop-sdk/checkly-action";

export const config: Partial<FullChecklyConfig> = {
  activated: true,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async (ctx: InferContext<typeof before>) => {
  await ctx.page.goto("https://google.com");
};
