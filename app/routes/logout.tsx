import type { ActionFunction } from "@remix-run/cloudflare";
import { AdminAuth } from "~/services/auth.server";

export const action: ActionFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  return auth.logout(request);
};
