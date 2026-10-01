export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  tipsCount?: number;
};

export type ProBreakdown = {
  frameworkTitle: string;
  strategy: string;
  checklist: string[];
  bonusResource?: string;
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
  readTimeMinutes?: number;
  keyTakeaways?: string[];
  actionStep?: string;
  proBreakdown?: ProBreakdown;
};

export type HomeData = {
  featured: Tip[];
  popular: Tip[];
  latest: Tip[];
};

