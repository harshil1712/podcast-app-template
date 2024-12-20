export interface Episode {
  id: string;
  title: string;
  description?: string;
  thumbnailKey: string;
  audioKey: string;
  duration: number;
  publishedAt: string;
  status?: "draft" | "published";
  transcript?: string;
}
