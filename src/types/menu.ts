export type PostSummary = {
  id: number;
  title: string;
};

export type ClosetItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  colorHex: string;
  imageUrl?: string;
  brandName: string | null;
  material: string;
  purchaseDate: string | null;
  purchasePrice: number | null;
  memo: string | null;
};

export type ItemCreateInput = Pick<
  ClosetItem,
  "name" | "category" | "color"
> & {
  colorHex?: string;
  imageUrl?: string;
  brandName?: string | null;
  material?: string;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  memo?: string | null;
};
