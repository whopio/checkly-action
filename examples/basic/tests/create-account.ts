import expect from "expect";
import { chromium } from "playwright";

export const config = {
  description: "should create an account and a company",
  tags: [],
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
  locations: [],
};

export default async () => {
  const loginResponse = {
    access_token: "token",
    token: "token",
    token_type: "Bearer",
    expires_in: 31556952,
    refresh_token: null,
    created_at: 1661370005,
    user: {
      id: 428401,
      created_at: 1661370005,
      name: null,
      username: "whop90db",
      email: "e2e@whop.com",
      phone: null,
      phone_verified: false,
      primary_discord_id: null,
      profile_photo: "",
      two_factor: false,
      two_factor_method: null,
      users_referred: 0,
      referral_credit: "$0.00",
      referral_link: "whop.com/?a=whop90db",
      seller_tier: "bronze",
      balance: 0.0,
      applied_to_be_seller: false,
      default_withdrawal_method: null,
      is_payable: null,
      vacation_mode: false,
      seller: false,
      usable_balance: 0.0,
      start_sleep: null,
      end_sleep: null,
      admin: null,
      support: null,
      fee: 0.25,
      unassigned_email: false,
      mobile_notifications: false,
      vat_id: null,
      discord_username: null,
      purchases_count: 0,
      rentals_count: 0,
      business_user: false,
      receipts_count: 0,
      whop_crypto_wallet: "0xb8b5e97cd110406b692ce756e2818b88b2751fbc",
      unverified_wallets: [],
      tag: "user_u9YTQBdvJymyW",
      profile_pic:
        "https://ui-avatars.com/api/?name=whop90db\u0026background=13192c\u0026color=fff",
    },
  };
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const baseURL = process.env.ENVIRONMENT_URL || process.env.SITE_URL;
  const url = new URL(baseURL!);
  context.addCookies([
    {
      name: "__whop_e2e",
      value: "1",
      domain: `.${url.host}`,
      path: "/",
      sameSite: "Lax",
      secure: true,
    },
  ]);
  const page = await context.newPage();

  await context.route("https://data.whop.com/api/v3/auth/signup", (route) => {
    return route.fulfill({
      body: JSON.stringify(loginResponse),
      contentType: "application/json",
    });
  });

  await context.route("https://data.whop.com/graphql", (route) => {
    const { operationName } = route.request().postDataJSON();
    if (operationName === "fetchUser") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            viewer: {
              user: {
                id: "user_0",
                admin: null,
                email: "e2e@whop.com",
                startSleep: null,
                endSleep: null,
                fee: 0.25,
                vacationMode: false,
                phone: null,
                createdAt: 1661370005,
                name: null,
                profilePic:
                  "https://ui-avatars.com/api/?name=whop90db\u0026background=13192c\u0026color=fff",
                username: "whope2e",
                phoneVerified: false,
                defaultWithdrawalMethod: null,
                fcmTokens: [],
                balance: 0.0,
                usableBalance: 0.0,
                support: null,
                sellerTier: "bronze",
                whopCryptoWallet: "0xb8b5e97cd110406b692ce756e2818b88b2751fbc",
                twoFactorMethod: null,
                twoFactor: false,
                discordUsername: null,
                permissionLevel: null,
                dataTheme: "system",
                unverifiedWallets: [],
                role: null,
                companies: [],
              },
            },
          },
        }),
      });
    } else if (operationName === "fetchUsersCompany") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ data: { viewer: { company: null } } }),
      });
    } else if (operationName === "createCompany") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            createCompany: {
              id: "biz_0",
              route: "test-company-1",
              title: "test company",
              image:
                "https://assets.whop.com/bots/images/6602.original.jpg?1661370421",
            },
          },
        }),
      });
    } else if (operationName === "fetchCompanySidebar") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            viewer: {
              company: {
                sidebar: {
                  affiliates: false,
                  apps: [],
                  collabs: true,
                  tokengated: false,
                  experiences: true,
                  home: true,
                  links: false,
                  members: true,
                  nftMints: true,
                  passes: false,
                  payments: false,
                  promoCodes: false,
                  raffles: false,
                  stats: false,
                  waitlist: false,
                  reviews: false,
                },
              },
            },
          },
        }),
      });
    } else if (operationName === "fetchAccessPasses") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            viewer: {
              company: {
                accessPasses: {
                  nodes: [],
                  pageInfo: { endCursor: null, hasNextPage: false },
                },
              },
            },
          },
        }),
      });
    } else if (operationName === "fetchChangelogs") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: { viewer: { user: { changelogs: [] } } },
        }),
      });
    } else if (operationName === "fetchEvents") {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            viewer: {
              company: {
                events: {
                  nodes: [
                    {
                      action:
                        "Welcome to Whop! Your business' activity will show up here!",
                      category: "welcome",
                      createdAt: 1661370422,
                      userId: null,
                    },
                  ],
                  pageInfo: { endCursor: "MQ", hasNextPage: false },
                },
              },
            },
          },
        }),
      });
    } else throw new Error(`Request not mocked: ${operationName}`);
  });

  await page.goto(baseURL!);

  const signupButton = page.locator('a[href="/signup"].w-button');
  expect(await signupButton.isVisible()).toBeTruthy();

  await signupButton.click();

  const withEmailButton = page.locator("text=Continue with Email");
  await withEmailButton.waitFor();
  expect(await withEmailButton.isVisible()).toBeTruthy();

  await withEmailButton.click();

  const emailInput = page.locator("input[type=email]");
  await emailInput.waitFor();
  await emailInput.type("tristan+123@whop.com");
  const passwordInput = page.locator("input[type=password]");
  await passwordInput.waitFor();
  await passwordInput.type("test");
  await page.click("button[type=submit]", { force: true, strict: true });

  await page.waitForURL(/\/onboarding$/);

  const companyNameInput = page.locator("input[type=text]").nth(0);
  await companyNameInput.waitFor();
  await companyNameInput.type("e2e testing");
  const continueButton = page.locator("button[type=button]").nth(0);
  await continueButton.click();
  const companyTypeButton = page.locator("text=I'm not sure yet");
  await companyTypeButton.waitFor();
  await companyTypeButton.click();
  await page.waitForURL(/\/home\?welcome=true$/);

  // Take a screenshot of the current page
  await page.screenshot({ path: "screenshot.jpg" });

  // Close the browser and end the session
  await browser.close();
};
