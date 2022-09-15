import { Browser, BrowserContext } from "playwright";

interface DefaultContext {
  browser: Browser;
  context: BrowserContext;
}

export default async (ctx: DefaultContext) => {
  console.log("after");
  await ctx.browser.close();
  return ctx;
};
