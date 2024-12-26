export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

function splitBuffer(buffer: ArrayBuffer, chunkSize: number): ArrayBuffer[] {
  const chunks: ArrayBuffer[] = [];
  let offset = 0;

  while (offset < buffer.byteLength) {
    const chunk = buffer.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  return chunks;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function transcribeEpisode(
  audioBuffer: ArrayBuffer,
  ai: Ai,
  chunkSize: number
): Promise<string> {
  const chunks = splitBuffer(audioBuffer, chunkSize);
  let fullTranscript = "";

  for (let i = 0; i < chunks.length; i++) {
    try {
      const base64Audio = arrayBufferToBase64(chunks[i]);
      const transcription = await ai.run("@cf/openai/whisper-large-v3-turbo", {
        audio: base64Audio,
      });

      fullTranscript += transcription.text + " ";
    } catch (error) {
      console.error(`Error transcribing chunk ${i + 1}:`, error);
      throw new Error(`Failed to transcribe chunk ${i + 1}`);
    }
  }
  return fullTranscript;
}
