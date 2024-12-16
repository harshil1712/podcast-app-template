import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import Layout from "~/components/Layout";
import PodcastCard from "~/components/PodcastCard";

export const meta: MetaFunction = () => {
  return [
    { title: "PodcastApp - Listen to Tech Insights" },
    {
      name: "description",
      content: "Listen to the most insightful conversations about technology",
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
}

export const loader: LoaderFunction = async () => {
  const featuredEpisodes: Episode[] = [
    {
      id: "1",
      title: "The Future of AI and Machine Learning",
      description:
        "In this episode, we explore the latest developments in AI and what they mean for the future of technology and society.",
      thumbnail: "/api/placeholder/400/240",
      duration: "45 min",
      publishedAt: "2024-12-15T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Building Scalable Systems",
      description:
        "Learn about the principles and practices behind building systems that can scale to millions of users.",
      thumbnail: "/api/placeholder/400/240",
      duration: "38 min",
      publishedAt: "2024-12-10T00:00:00.000Z",
    },
    {
      id: "3",
      title: "The Evolution of Web Development",
      description:
        "From static HTML to modern frameworks - we discuss how web development has evolved and where it's heading.",
      thumbnail: "/api/placeholder/400/240",
      duration: "42 min",
      publishedAt: "2024-12-05T00:00:00.000Z",
    },
  ];

  return Response.json({ featuredEpisodes });
};

export default function Index() {
  const { featuredEpisodes } = useLoaderData<{ featuredEpisodes: Episode[] }>();

  return (
    <Layout>
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Tech Insights
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Listen to in-depth conversations with industry leaders about
            technology, innovation, and the future of digital transformation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Episodes
          </h2>
          <Link
            to="/episodes"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all episodes
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredEpisodes.map((episode) => (
            <PodcastCard key={episode.id} {...episode} />
          ))}
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Never Miss an Episode
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get notified when new episodes are
              released.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
