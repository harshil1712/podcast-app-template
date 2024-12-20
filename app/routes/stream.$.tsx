import { LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ params, context, request }) => {
  const key = params["*"];
  if (!key) {
    throw new Response("Not Found", { status: 404 });
  }

  const obj = await context.cloudflare.env.BUCKET.get(key);

  if (!obj) {
    throw new Response("Not Found", { status: 404 });
  }

  // Get the array buffer from the R2 object
  const arrayBuffer = await obj.arrayBuffer();

  // Create headers
  const headers = new Headers();
  headers.set(
    "Content-Type",
    obj.httpMetadata?.contentType || "application/octet-stream"
  );

  // Handle range requests
  const range = request.headers.get("range");
  if (range) {
    const bytes = range.replace("bytes=", "").split("-");
    const start = parseInt(bytes[0], 10);
    const end = bytes[1] ? parseInt(bytes[1], 10) : obj.size - 1;
    const chunk = new Uint8Array(arrayBuffer).slice(start, end + 1);

    headers.set("Content-Range", `bytes ${start}-${end}/${obj.size}`);
    headers.set("Content-Length", `${chunk.byteLength}`);
    headers.set("Accept-Ranges", "bytes");

    return new Response(chunk, {
      status: 206,
      headers,
    });
  }

  // Return full file if no range is requested
  return new Response(arrayBuffer, { headers });
};
