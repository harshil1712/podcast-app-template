import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin({
      getLoadContext,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          // Define your routes here
          route("/", "routes/_index.tsx", { index: true });
          route("episodes", "routes/episodes/layout.tsx", () => {
            route("", "routes/episodes/_index.tsx", { index: true });
            route(":episodeId", "routes/episodes/episode.tsx");
          });

          route("admin", "routes/admin/layout.tsx", () => {
            route("", "routes/admin/_index.tsx", { index: true });
            route("episodes", "routes/admin/episodes.tsx");
            route("episodes/new", "routes/admin/episodes.new.tsx");
            route(
              "episodes/edit/:episodeId",
              "routes/admin/episodes.edit.$id.tsx"
            );
          });
        });
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
  },
});
