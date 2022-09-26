import type { DefaultContext } from "@whop-sdk/checkly-action";
import archive from "./test.har";

export default async (ctx: DefaultContext) => {
  await ctx.browser.close();
};
