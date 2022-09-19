import type { DefaultContext } from "@whop-sdk/checkly-action";
import fileName from "./test.har";

export default async (ctx: DefaultContext) => {
  console.log(fileName);
  return {
    ...ctx,
    page: await ctx.context.newPage(),
  };
};
