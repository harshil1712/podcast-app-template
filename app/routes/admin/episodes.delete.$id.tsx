import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
// import { requireAdmin } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
  // await requireAdmin(request);

  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const episodeId = params.episodeId;

  try {
    // Here you would:
    // 1. Delete associated files from R2
    // 2. Delete the episode record from your database
    // 3. Clean up any related data (transcripts, analytics, etc.)

    return redirect("/admin/episodes");
  } catch (error) {
    throw new Response("Failed to delete episode", { status: 500 });
  }
};

export const loader = () => redirect("/admin/episodes");
