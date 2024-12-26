import { useState } from "react";

interface TranscriptSectionProps {
  transcription: string;
}

export default function TranscriptSection({
  transcription,
}: TranscriptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Transcript</h2>
      <div
        className={`space-y-4 ${
          !isExpanded && "max-h-96 overflow-hidden relative"
        }`}
      >
        <div className="group hover:bg-gray-50 p-2 rounded-lg -mx-2">
          <p className="text-gray-700 leading-relaxed">{transcription}</p>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        {isExpanded ? "Show Less" : "Show Full Transcript"}
      </button>
    </div>
  );
}
