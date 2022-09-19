import type prev from "../_before";
import type { InferContext } from "@whop-sdk/checkly-action";

export default async (ctx: InferContext<typeof prev>) => {
  return {
    ...ctx,
  };
};
