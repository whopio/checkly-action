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

export interface TestingHooks {
  before: string[];
  after: string[];
}
