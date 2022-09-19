import type { DefaultContext } from "@whop-sdk/checkly-action";
import { release } from "./test.har";

export default async (ctx: DefaultContext) => {
  await release();
  await ctx.browser.close();
};
