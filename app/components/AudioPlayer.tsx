import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Rewind,
  FastForward,
} from "lucide-react";
import { formatDuration } from "~/utils/helpers";

interface AudioPlayerProps {
  src: string;
  title: string;
  thumbnail?: string;
  duration: number;
  onPlay?: () => void;
}

export default function AudioPlayer({
  src,
  title,
  thumbnail,
  duration,
  onPlay,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(parseFloat(audio.currentTime.toFixed(0)));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (!audioRef.current) return;

    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !audioRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.currentTime + 10,
      duration
    );
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      audioRef.current.currentTime - 10,
      0
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Thumbnail and Title */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-grow justify-center">
            <button
              onClick={skipBackward}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Rewind size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
            >
              {isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-1" />
              )}
            </button>

            <button
              onClick={skipForward}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FastForward size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div
          ref={sliderRef}
          className="mt-3 h-1 bg-gray-200 rounded cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-indigo-600 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <audio
          ref={audioRef}
          src={`/stream/${src}`}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
