import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { R2Service } from "~/utils/r2.server";

export const loader = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
  const r2 = new R2Service(context.cloudflare.env.BUCKET);
  const { id } = params;

  if (!id) {
    return Response.json({ success: false, message: "No id provided" });
  }

  const imageObj = await r2.getImage(`images/${id}`);

  if (!imageObj) {
    return Response.json({ success: false, message: "No image found" });
  }

  return new Response(imageObj.body, {
    headers: {
      "Content-Type":
        imageObj.httpMetadata?.contentType || "application/octet-stream",
    },
  });
};
