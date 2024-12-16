import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Calendar, Clock, User, Bookmark } from "lucide-react";
import AudioPlayer from "~/components/AudioPlayer";
import TranscriptSection from "~/components/TranscriptSection";
import PodcastCard from "~/components/PodcastCard";

interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  hosts: string[];
  audioUrl: string;
  transcript: {
    id: string;
    timestamp: string;
    text: string;
  }[];
}

interface LoaderData {
  episode: Episode;
  relatedEpisodes: Episode[];
}

export const loader: LoaderFunction = async ({ params }) => {
  // This would typically fetch from your database
  const episode: Episode = {
    id: params.episodeId!,
    title: "The Future of AI and Machine Learning",
    description:
      "In this episode, we explore the latest developments in AI and what they mean for the future of technology and society. Join us as we discuss the implications of recent breakthroughs and what they mean for developers and businesses alike.",
    thumbnail: "/api/placeholder/1200/600",
    duration: "45 min",
    publishedAt: "2024-12-15T00:00:00.000Z",
    hosts: ["John Doe", "Jane Smith"],
    audioUrl: "/path/to/audio.mp3",
    transcript: [
      {
        id: "1",
        timestamp: "00:00",
        text: "Welcome to today's episode where we'll be discussing the future of AI...",
      },
      // Add more transcript segments
    ],
  };

  const relatedEpisodes: Episode[] = [
    // Add related episodes
  ];

  return Response.json({ episode, relatedEpisodes });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Episode Not Found - PodcastApp" },
      {
        name: "description",
        content: "The requested episode could not be found.",
      },
    ];
  }

  return [
    { title: `${data.episode.title} - PodcastApp` },
    { name: "description", content: data.episode.description },
  ];
};

export default function EpisodeDetail() {
  const { episode, relatedEpisodes } = useLoaderData<LoaderData>();

  return (
    <>
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 md:aspect-h-6 lg:aspect-h-4 max-h-[600px] overflow-hidden">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {episode.title}
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mb-6">
              {episode.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>
                  {new Date(episode.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{episode.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={20} />
                <span>{episode.hosts.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TranscriptSection segments={episode.transcript} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Episode Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4">
                <div className="flex items-center justify-center gap-2">
                  <Bookmark size={20} />
                  <span>Save Episode</span>
                </div>
              </button>
              <div className="flex gap-4">
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Share
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Download
                </button>
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About the Hosts</h2>
              <div className="space-y-4">
                {episode.hosts.map((host) => (
                  <div key={host} className="flex items-center gap-4">
                    <img
                      src="/api/placeholder/40/40"
                      alt={host}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{host}</h3>
                      <p className="text-sm text-gray-500">Host</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Episodes */}
            {relatedEpisodes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Related Episodes</h2>
                {relatedEpisodes.map((relatedEpisode) => (
                  <PodcastCard key={relatedEpisode.id} {...relatedEpisode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AudioPlayer
        audioUrl={episode.audioUrl}
        title={episode.title}
        thumbnail={episode.thumbnail}
      />
    </>
  );
}
