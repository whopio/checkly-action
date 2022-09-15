import type prev from "../_before";

type InferContext<P extends (ctx: any) => Promise<any>> = P extends (
  ctx: any
) => Promise<infer T>
  ? T
  : never;

export default async (ctx: InferContext<typeof prev>) => {
  return {
    ...ctx,
    page: await ctx.context.newPage(),
  };
};
