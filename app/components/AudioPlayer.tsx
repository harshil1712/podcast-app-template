import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  thumbnail: string;
}

export default function AudioPlayer({
  audioUrl,
  title,
  thumbnail,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={thumbnail}
            alt={title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="hidden sm:block">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <div className="text-sm text-gray-500">14:23 / 45:00</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12 flex items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="text-white" size={24} />
            ) : (
              <Play className="text-white ml-1" size={24} />
            )}
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 w-1/3">
          <div className="flex-1">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="absolute h-2 w-1/3 bg-indigo-600 rounded-full"></div>
              </div>
              <div className="absolute h-4 w-4 bg-indigo-600 rounded-full -top-1 left-1/3 transform -translate-x-1/2"></div>
            </div>
          </div>
          <Volume2 size={20} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
