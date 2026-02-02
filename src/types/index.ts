export type Sentiment = 'positive' | 'neutral' | 'negative' | 'critical';

export interface Workspace {
  id: string;
  name: string; // Ex: "Campanha Prefeito Silva 2026"
  slug: string;
  createdAt: string;
}

export interface Region {
  id: string;
  workspaceId: string;
  name: string; // Ex: "Centro", "Zona Norte"
  color: string; // Hex or Tailwind class
}

export interface Category {
  id: string;
  workspaceId: string;
  name: string; // Ex: "Saúde", "Educação"
  icon: string; // Lucide icon name
  color: string;
}

export interface Feedback {
  id: string;
  workspaceId: string;
  regionId: string;
  categoryId: string;
  description: string;
  sentiment: Sentiment;
  source: string; // 'whatsapp', 'manual', 'n8n'
  phoneHash?: string;
  createdAt: string; // ISO string
}

export interface Stats {
  totalFeedbacks: number;
  sentimentDistribution: Record<Sentiment, number>;
  topRegion: { name: string; count: number } | null;
  topCategory: { name: string; count: number } | null;
}
