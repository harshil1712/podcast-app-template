import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import PodcastCard from "~/components/PodcastCard";
import Pagination from "~/components/Pagination";
import { Episode } from "~/types";
import { D1Service } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "All Episodes - PodcastApp" },
    {
      name: "description",
      content:
        "Browse all our podcast episodes about technology and innovation",
    },
  ];
};

interface LoaderData {
  episodes: Episode[];
}

export const loader: LoaderFunction = async ({ request, context }) => {
  // const url = new URL(request.url);
  // const page = parseInt(url.searchParams.get("page") ?? "1");
  const db = new D1Service(context.cloudflare.env.DB);
  const r2_public_url = context.cloudflare.env.R2_PUBLIC_URL;

  const episodes = await db.getPublishedEpisodes();

  episodes.forEach((episode) => {
    episode.thumbnailKey = `${r2_public_url}/${episode.thumbnailKey}`;
  });

  return Response.json({
    episodes: episodes,
  });
};

export default function Episodes() {
  const { episodes } = useLoaderData<LoaderData>();

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            All Episodes
          </h1>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {episodes.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {episodes.map((episode) => (
                <PodcastCard key={episode.id} {...episode} />
              ))}
            </div>

            {/* <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/episodes"
            /> */}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              No episodes found
            </h2>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new episodes.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
