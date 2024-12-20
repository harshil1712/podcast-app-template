import { Play } from "lucide-react";
import { Link } from "@remix-run/react";
import { formatDate, formatDuration } from "~/utils/helpers";
import { Episode } from "~/types";

export default function PodcastCard({
  id,
  title,
  description,
  thumbnailKey,
  duration,
  publishedAt,
}: Episode) {
  return (
    <Link to={`/episodes/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={thumbnailKey}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="absolute bottom-4 right-4 h-12 w-12 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors transform hover:scale-110">
              <Play className="text-white ml-1" size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 line-clamp-2 text-sm mb-4">
            {description}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{formatDuration(duration)}</span>
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
