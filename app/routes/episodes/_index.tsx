import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import PodcastCard from "~/components/PodcastCard";
import Pagination from "~/components/Pagination";
import Layout from "~/components/Layout";

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

interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  category: string;
}

interface LoaderData {
  episodes: Episode[];
  categories: string[];
  currentPage: number;
  totalPages: number;
  currentCategory?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const category = url.searchParams.get("category") ?? undefined;
  const sort = url.searchParams.get("sort") ?? "newest";

  // This would typically fetch from your database
  const allEpisodes: Episode[] = [
    {
      id: "1",
      title: "The Future of AI and Machine Learning",
      description:
        "In this episode, we explore the latest developments in AI and what they mean for the future of technology and society.",
      thumbnail: "/api/placeholder/400/240",
      duration: "45 min",
      publishedAt: "2024-12-15T00:00:00.000Z",
      category: "Artificial Intelligence",
    },
    // ... add more episodes here
  ];

  // Filter by category if specified
  let filteredEpisodes = category
    ? allEpisodes.filter((ep) => ep.category === category)
    : allEpisodes;

  // Sort episodes
  filteredEpisodes.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      default: // newest
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  });

  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedEpisodes = filteredEpisodes.slice(start, start + itemsPerPage);

  // Get unique categories
  const categories = Array.from(new Set(allEpisodes.map((ep) => ep.category)));

  return Response.json({
    episodes: paginatedEpisodes,
    categories,
    currentPage,
    totalPages,
    currentCategory: category,
  });
};

export default function Episodes() {
  const { episodes, categories, currentPage, totalPages, currentCategory } =
    useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/episodes"
            />
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
