import { chromium } from "playwright";

export const config = {
  description: "should be able to log in",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://google.com");
  await browser.close();
};
