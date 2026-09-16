import { prisma } from "../lib/prisma.js";
const include = { category: true };
const published = { status: "PUBLISHED" as const };


export const tips = {
  home: async () => ({
    featured: await prisma.tip.findMany({
      where: { ...published, isFeatured: true },
      include,
      take: 1,
      orderBy: { publishedAt: "desc" },
    }),
    popular: await prisma.tip.findMany({
      where: published,
      include,
      take: 6,
      orderBy: { viewCount: "desc" },
    }),
    latest: await prisma.tip.findMany({
      where: published,
      include,
      take: 20,
      orderBy: { publishedAt: "desc" },
    }),
  }),
  categories: () =>
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  byCategory: (slug: string) =>
    prisma.tip.findMany({
      where: { ...published, category: { slug } },
      include,
      orderBy: { publishedAt: "desc" },
    }),
  byId: async (id: string) => {
    const tip = await prisma.tip.findFirst({
      where: { id, ...published },
      include,
    });
    if (tip)
      await prisma.tip.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    return tip;
  },
  related: async (id: string) => {
    const tip = await prisma.tip.findUnique({ where: { id } });
    return tip
      ? prisma.tip.findMany({
          where: { ...published, categoryId: tip.categoryId, NOT: { id } },
          include,
          take: 4,
          orderBy: { publishedAt: "desc" },
        })
      : [];
  },
  search: (q: string) =>
    prisma.tip.findMany({
      where: {
        ...published,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      include,
      take: 20,
      orderBy: { publishedAt: "desc" },
    }),
};
