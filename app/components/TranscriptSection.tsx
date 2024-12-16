import { useState } from "react";

interface TranscriptSegment {
  id: string;
  timestamp: string;
  text: string;
}

interface TranscriptSectionProps {
  segments: TranscriptSegment[];
}

export default function TranscriptSection({
  segments,
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
        {segments.map((segment) => (
          <div
            key={segment.id}
            className="group hover:bg-gray-50 p-2 rounded-lg -mx-2"
          >
            <div className="flex items-start gap-4">
              <button className="text-sm text-gray-500 hover:text-indigo-600">
                {segment.timestamp}
              </button>
              <p className="text-gray-700 leading-relaxed">{segment.text}</p>
            </div>
          </div>
        ))}
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
