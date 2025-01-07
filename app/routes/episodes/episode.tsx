import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Calendar, Clock, Share } from "lucide-react";
import AudioPlayer from "~/components/AudioPlayer";
import TranscriptSection from "~/components/TranscriptSection";
import { Episode } from "~/types";
import { D1Service } from "~/utils/db.server";
import { formatDate, formatDuration } from "~/utils/helpers";

interface LoaderData {
  episode: Episode;
  relatedEpisodes: Episode[];
}

export const loader: LoaderFunction = async ({ params, context }) => {
  const episodeId = params.episodeId;

  if (typeof episodeId !== "string") {
    throw new Error("Invalid episode ID");
  }
  const db = new D1Service(context.cloudflare.env.DB);

  const episode = (await db.getEpisode(episodeId)) as Partial<Episode>;
  if (!episode) {
    throw new Response("Episode not found", { status: 404 });
  }

  return Response.json({ episode });
};

export const meta: MetaFunction = ({ data }) => {
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
  const { episode } = useLoaderData<LoaderData>();

  return (
    <>
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 md:aspect-h-6 lg:aspect-h-4 max-h-[600px] overflow-hidden">
          <img
            src={`../thumbnail/${episode.thumbnailKey}`}
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
                <span>{formatDate(episode.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span>{formatDuration(episode.duration)}</span>
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
            {episode.transcript && (
              <TranscriptSection transcription={episode.transcript} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Episode Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black">
                <div className="flex items-center justify-center gap-2">
                  <Share size={20} />
                  <span>Share Episode</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AudioPlayer
        src={episode.audioKey}
        title={episode.title}
        thumbnail={`../thumbnail/${episode.thumbnailKey}`}
        duration={episode.duration}
      />
    </>
  );
}
