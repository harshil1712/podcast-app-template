const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AUDIO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export interface R2Object {
  key: string;
  url?: string;
  size: number;
}

export class R2Service {
  constructor(
    private readonly bucket: R2Bucket,
    private readonly baseUrl?: string
  ) {}

  async uploadAudio(audio: File): Promise<R2Object> {
    if (!audio) {
      throw new Error("No audio file provided");
    }

    if (!ALLOWED_AUDIO_TYPES.includes(audio.type)) {
      throw new Error("Invalid audio file type");
    }

    if (audio.size > MAX_AUDIO_SIZE) {
      throw new Error("Audio file too large");
    }

    const key = `audio/${Date.now()}-${audio.name.replaceAll(" ", "-")}`;
    try {
      await this.bucket.put(key, audio, {
        httpMetadata: {
          contentType: audio.type,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to upload audio: ${error.message}`);
    }

    return {
      key,
      size: audio.size,
    };
  }

  async uploadImage(image: File): Promise<R2Object> {
    if (!image) {
      throw new Error("No image file provided");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      throw new Error("Invalid image file type");
    }

    if (image.size > MAX_IMAGE_SIZE) {
      throw new Error("Image file too large");
    }

    const key = `images/${Date.now()}-${image.name.replaceAll(" ", "-")}`;
    try {
      await this.bucket.put(key, image, {
        httpMetadata: {
          contentType: image.type,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    return {
      key,
      url: `${this.baseUrl}/${key}`,
      size: image.size,
    };
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) throw new Error("Key is required");
    try {
      await this.bucket.delete(key);
    } catch (error: any) {
      throw new Error(`Failed to delete object: ${error.message}`);
    }
  }

  async generatePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // Note: Standard R2 doesn't support presigned URLs directly
    // This is a simplified example using a time-based token
    const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
    const token = await this.generateToken(key, timestamp);
    return `${this.baseUrl}/stream/${token}/${key}`;
  }

  private async generateToken(key: string, timestamp: number): Promise<string> {
    // Implement your token generation logic here
    // This should match your Worker's validation logic
    return "token";
  }
}
