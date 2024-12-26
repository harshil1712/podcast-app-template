import { createRequestHandler, type ServerBuild } from "@remix-run/cloudflare";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from "./build/server"; // eslint-disable-line import/no-unresolved
import { getLoadContext } from "./load-context";
import { R2Service } from "~/utils/r2.server";
import { D1Service } from "~/utils/db.server";
import { transcribeEpisode } from "~/utils/helpers";

const CHUNK_SIZE = 2.5 * 1024 * 1024;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRemixRequest = createRequestHandler(build as any as ServerBuild);

export default {
  async fetch(request, env, ctx) {
    try {
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            // This object matches the return value from Wrangler's
            // `getPlatformProxy` used during development via Remix's
            // `cloudflareDevProxyVitePlugin`:
            // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
            cf: request.cf,
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            caches,
            env,
          },
        },
      });
      return await handleRemixRequest(request, loadContext);
    } catch (error) {
      console.log(error);
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
  async queue(batch, env) {
    const r2 = new R2Service(env.BUCKET);
    const db = new D1Service(env.DB);
    for (let message of batch.messages) {
      const body = message.body as { object: { key: string } };
      console.log(`Processing file: ${body.object.key}`);
      const key = body.object.key;

      try {
        const audio = await r2.getAudio(key);

        if (!audio) {
          console.error(`Audio not found: ${key}`);
          return;
        }

        const buffer = await audio.arrayBuffer();

        const transcript = await transcribeEpisode(buffer, env.AI, CHUNK_SIZE);

        await db.upsertTranscript(transcript, key);

        console.log(`Transcript created for ${key}`);

        message.ack();
      } catch (error: any) {
        console.log(`Failed to create transcript`);
        console.error(error);
        message.retry({ delaySeconds: 10 });
      }
    }
  },
} satisfies ExportedHandler<Env>;
