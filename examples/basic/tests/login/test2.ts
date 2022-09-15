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

type InferContext<P extends (ctx: any) => Promise<any>> = P extends (
  ctx: any
) => Promise<infer T>
  ? T
  : never;

export default async (ctx: InferContext<typeof before>) => {
  await ctx.page.goto("https://google.com");
};
