import { DefaultContext } from "@whop-sdk/checkly-action";

export default async (ctx: DefaultContext) => {
  const baseURL = process.env.ENVIRONMENT_URL || process.env.SITE_URL;
  const url = new URL(baseURL!);

  ctx.context.addCookies([
    {
      name: "__whop_e2e",
      value: "1",
      domain: `.${url.host}`,
      path: "/",
      sameSite: "Lax",
      secure: true,
    },
  ]);

  return {
    ...ctx,
    page: await ctx.context.newPage(),
    url,
  };
};
