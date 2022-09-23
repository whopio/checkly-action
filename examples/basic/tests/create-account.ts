import { DefaultContext, CheckConfig } from "@whop-sdk/checkly-action";

export const config: CheckConfig = {
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
};

export default async ({ browser }: DefaultContext) => {
  const page = await browser.newPage();
  await page.goto("https://google.com");
};
