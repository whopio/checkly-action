import type { DefaultContext } from "@whop-sdk/checkly-action";

export default async (ctx: DefaultContext) => {
  await ctx.browser.close();
};
