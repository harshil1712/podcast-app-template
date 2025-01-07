import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import PodcastCard from "~/components/PodcastCard";
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
  const db = new D1Service(context.cloudflare.env.DB);

  const episodes = await db.getPublishedEpisodes();

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
