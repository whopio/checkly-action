import { Browser, BrowserContext, chromium, Page } from "playwright";

interface DefaultContext {
  browser: Browser;
  context: BrowserContext;
}

export default async (ctx: DefaultContext) => {
  return {
    ...ctx,
    page: await ctx.context.newPage(),
  };
};
