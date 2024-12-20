import React, { useState, useRef } from "react";
import { Form } from "@remix-run/react";
import { Clock, Upload, X } from "lucide-react";

interface EpisodeFormProps {
  initialData?: {
    title: string;
    description: string;
  };
}

export default function EpisodeForm({ initialData }: EpisodeFormProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create an audio element to get duration
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      setDuration(Math.round(audio.duration));
      URL.revokeObjectURL(objectUrl);
    });

    audio.addEventListener("error", () => {
      console.error("Error loading audio file");
      URL.revokeObjectURL(objectUrl);
    });

    audio.src = objectUrl;
    setAudioFile(file);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
    setThumbnailFile(file);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const clearAudio = () => {
    setAudioFile(null);
    setDuration(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
  };

  return (
    <Form method="post" className="space-y-6" encType="multipart/form-data">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Episode Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={initialData?.title}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          defaultValue={initialData?.description}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audio File
          </label>
          <div className="relative">
            {audioFile ? (
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Clock size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {audioFile.name}
                      </p>
                      {duration && (
                        <p className="text-sm text-gray-500">
                          Duration: {formatDuration(duration)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearAudio}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <input type="hidden" name="duration" value={duration || 0} />
              </div>
            ) : (
              <div
                onClick={() => audioInputRef.current?.click()}
                className="flex items-center justify-center w-full px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400" size={32} />
                  <p className="mt-2 text-gray-600">
                    Drop your audio file here or click to upload
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    MP3, WAV up to 500MB
                  </p>
                </div>
              </div>
            )}
            <input
              ref={audioInputRef}
              type="file"
              name="audio"
              accept="audio/mp3, audio/wav, audio/mpeg"
              onChange={handleAudioChange}
              className="hidden"
              required={!initialData}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div className="relative">
            {thumbnailPreview ? (
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {thumbnailFile?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round((thumbnailFile?.size || 0) / 1024)}KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="flex items-center justify-center w-full px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400" size={32} />
                  <p className="mt-2 text-gray-600">
                    Drop your thumbnail here or click to upload
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            )}
            <input
              ref={thumbnailInputRef}
              type="file"
              name="thumbnail"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleThumbnailChange}
              className="hidden"
              required={!initialData}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {initialData ? "Update Episode" : "Create Episode"}
        </button>
      </div>
    </Form>
  );
}
