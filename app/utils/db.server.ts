interface Episode {
  title: string;
  description: string;
  audioKey: string;
  thumbnailKey: string;
  duration: number;
  status?: "draft" | "published";
  publishedAt?: string;
}

export class D1Service {
  constructor(private readonly db: D1Database) {}

  // Create a new episode
  async createEpisode(episode: Episode): Promise<void> {
    try {
      await this.db
        .prepare(
          "INSERT INTO episodes (title, description, audio_key, thumbnail_key, duration) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(
          episode.title,
          episode.description,
          episode.audioKey,
          episode.thumbnailKey,
          episode.duration
        )
        .run();
    } catch (error: any) {
      throw new Error(`Failed to create episode: ${error.message}`);
    }
  }

  // Get the episode with the given ID
  async getEpisode(id: string): Promise<Episode | null> {
    const result = await this.db
      .prepare(
        "SELECT title, description, audio_key as audioKey, thumbnail_key as thumbnailKey, status, published_at as publishedAt FROM episodes WHERE id = ?"
      )
      .bind(id)
      .first<Episode>();
    return result || null;
  }

  // Get all episodes
  async getEpisodes(): Promise<Episode[]> {
    const result = await this.db
      .prepare(
        "SELECT id, title, description, audio_key as audioKey, thumbnail_key as thumbnailKey, published_at as publishedAt, status, duration FROM episodes"
      )
      .all();
    return result.results as unknown as Episode[];
  }

  // Update the episode with the given ID
  async updateEpisode(id: string, episode: Partial<Episode>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (episode.title !== undefined) {
        updates.push("title = ?");
        values.push(episode.title);
      }
      if (episode.description !== undefined) {
        updates.push("description = ?");
        values.push(episode.description);
      }
      if (episode.audioKey !== undefined) {
        updates.push("audio_key = ?");
        values.push(episode.audioKey);
      }
      if (episode.thumbnailKey !== undefined) {
        updates.push("thumbnail_key = ?");
        values.push(episode.thumbnailKey);
      }
      if (episode.duration !== undefined) {
        updates.push("duration = ?");
        values.push(episode.duration);
      }

      if (updates.length === 0) {
        return; // Nothing to update
      }

      values.push(id); // Add id for WHERE clause

      const query = `UPDATE episodes SET ${updates.join(", ")} WHERE id = ?`;
      await this.db
        .prepare(query)
        .bind(...values)
        .run();
    } catch (error: any) {
      throw new Error(`Failed to update episode: ${error.message}`);
    }
  }

  // Delete the episode with the given ID
  async deleteEpisode(
    id: string
  ): Promise<{ audioKey: string; thumbnailKey: string }> {
    const episode = await this.getEpisode(id);
    if (!episode) {
      throw new Error("Episode not found");
    }

    await this.db.prepare("DELETE FROM episodes WHERE id = ?").bind(id).run();

    return { audioKey: episode.audioKey, thumbnailKey: episode.thumbnailKey };
  }

  // Publish or unpublish the episode with the given ID
  async publishEpisode(id: string): Promise<void> {
    const episode = await this.getEpisode(id);
    if (!episode) {
      throw new Error("Episode not found");
    }

    const status = episode.publishedAt ? "draft" : "published";
    const publishedAt =
      status === "published" ? new Date().toISOString() : null;

    await this.db
      .prepare("UPDATE episodes SET status = ?, published_at = ? WHERE id = ?")
      .bind(status, publishedAt, id)
      .run();
  }

  // Get the published episodes
  async getPublishedEpisodes(): Promise<Episode[]> {
    const result = await this.db
      .prepare(
        "SELECT id, title, description, audio_key as audioKey, thumbnail_key as thumbnailKey, published_at as publishedAt, duration FROM episodes WHERE status = 'published'"
      )
      .all();
    return result.results as unknown as Episode[];
  }

  // Get total episodes
  async getTotalEpisodes(): Promise<number> {
    const result = await this.db
      .prepare("SELECT COUNT(*) as total FROM episodes")
      .run();
    return result.results[0].total as number;
  }
}
