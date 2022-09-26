declare module "*.har" {
  const e: any;
  export default e;
}

declare module "@whop-sdk/checkly-action" {
  import { Browser, BrowserContext } from "playwright";

  export interface DefaultContext {
    browser: Browser;
    context: BrowserContext;
  }

  export type InferContext<P extends (ctx: any) => Promise<any>> = P extends (
    ctx: any
  ) => Promise<infer T>
    ? T
    : never;

  export interface ChecklyConfig {
    locations: string[];
    runtimeId: string;
    frequency: number;
    on: "chromium" | "firefox" | "webkit";
  }

  export type FullChecklyConfig = ChecklyConfig & {
    activated: boolean;
    muted: boolean;
    shouldFail: boolean;
    doubleCheck: boolean;
  };

  export type CheckConfig = Partial<FullChecklyConfig>;
}
