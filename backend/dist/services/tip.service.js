"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tips = void 0;
const prisma_js_1 = require("../lib/prisma.js");
const include = { category: true };
const published = { status: "PUBLISHED" };
// Helper to compute reading time, action steps, takeaways, and pro breakdown
function enrichTip(tip) {
    const wordCount = (tip.content || "").split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.round(wordCount / 65));
    // Synthesize structured key takeaways from the excerpt and content
    const sentences = tip.content
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20);
    const keyTakeaways = [
        tip.excerpt,
        sentences[0] ?? "Apply this method immediately in your daily workflow.",
        sentences[1] ?? "Consistency over intensity creates sustainable results.",
    ].slice(0, 3);
    const actionStep = sentences[sentences.length - 1] ??
        "Take 2 minutes right now to apply this insight to your current priority.";
    const proBreakdown = {
        frameworkTitle: "Execution Framework & Pro Tactics",
        strategy: `To master "${tip.title}", follow a 3-phase rollout: 1) Audit your current baseline, 2) Implement in a 7-day test loop, and 3) Automate or delegate once friction disappears.`,
        checklist: [
            "Define your baseline metric before changing the routine.",
            "Remove 1 friction point or distraction that slows execution.",
            "Schedule a 10-minute weekly review to measure progress.",
        ],
        bonusResource: "Pro Tip: Pair this with a dedicated 15-minute morning review block for maximum compounding.",
    };
    return {
        ...tip,
        readTimeMinutes,
        keyTakeaways,
        actionStep,
        proBreakdown,
    };
}
exports.tips = {
    home: async () => {
        const [featuredRaw, popularRaw, latestRaw] = await Promise.all([
            prisma_js_1.prisma.tip.findMany({
                where: { ...published, isFeatured: true },
                include,
                take: 1,
                orderBy: { publishedAt: "desc" },
            }),
            prisma_js_1.prisma.tip.findMany({
                where: published,
                include,
                take: 6,
                orderBy: { viewCount: "desc" },
            }),
            prisma_js_1.prisma.tip.findMany({
                where: published,
                include,
                take: 24,
                orderBy: { publishedAt: "desc" },
            }),
        ]);
        return {
            featured: featuredRaw.map(enrichTip),
            popular: popularRaw.map(enrichTip),
            latest: latestRaw.map(enrichTip),
        };
    },
    categories: async () => {
        const cats = await prisma_js_1.prisma.category.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { tips: true },
                },
            },
            orderBy: { name: "asc" },
        });
        return cats.map((cat) => ({
            ...cat,
            tipsCount: cat._count.tips,
        }));
    },
    byCategory: async (slug) => {
        const list = await prisma_js_1.prisma.tip.findMany({
            where: { ...published, category: { slug } },
            include,
            orderBy: { publishedAt: "desc" },
        });
        return list.map(enrichTip);
    },
    byId: async (id) => {
        const tip = await prisma_js_1.prisma.tip.findFirst({
            where: { id, ...published },
            include,
        });
        if (tip) {
            await prisma_js_1.prisma.tip.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
            return enrichTip(tip);
        }
        return null;
    },
    related: async (id) => {
        const tip = await prisma_js_1.prisma.tip.findUnique({ where: { id } });
        if (!tip)
            return [];
        const list = await prisma_js_1.prisma.tip.findMany({
            where: { ...published, categoryId: tip.categoryId, NOT: { id } },
            include,
            take: 4,
            orderBy: { publishedAt: "desc" },
        });
        return list.map(enrichTip);
    },
    search: async (q) => {
        const list = await prisma_js_1.prisma.tip.findMany({
            where: {
                ...published,
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { excerpt: { contains: q, mode: "insensitive" } },
                    { content: { contains: q, mode: "insensitive" } },
                ],
            },
            include,
            take: 24,
            orderBy: { publishedAt: "desc" },
        });
        return list.map(enrichTip);
    },
    react: async (id, _type) => {
        const tip = await prisma_js_1.prisma.tip.findUnique({ where: { id } });
        if (!tip)
            return null;
        // Bump view count as positive engagement
        const updated = await prisma_js_1.prisma.tip.update({
            where: { id },
            data: { viewCount: { increment: 2 } },
            include,
        });
        return enrichTip(updated);
    },
};
