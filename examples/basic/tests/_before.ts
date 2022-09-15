import { Browser, BrowserContext, Page } from "playwright";

interface DefaultContext {
  browser: Browser;
  context: BrowserContext;
}

export default async (ctx: DefaultContext) => {
  return ctx;
};
