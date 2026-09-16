export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
};
export type Tip = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: Category;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt: string;
  viewCount: number;
  isFeatured?: boolean;
};
export type HomeData = { featured: Tip[]; popular: Tip[]; latest: Tip[] };
