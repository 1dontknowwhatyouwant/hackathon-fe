export type PostSummary = {
  id: number;
  title: string;
};

export type RecommendationPreview = {
  id: string;
  title: string;
  description: string;
  keyword: string;
};

export type ClosetItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  colorHex: string;
};

export type ItemCreateInput = Omit<ClosetItem, "id" | "colorHex"> & {
  colorHex?: string;
};
