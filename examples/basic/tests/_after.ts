import type { DefaultContext } from "@whop-sdk/checkly-action";

export default async (ctx: DefaultContext) => {
  return {
    ...ctx,
    page: await ctx.context.newPage(),
  };
};
