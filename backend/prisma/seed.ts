import { PrismaClient, TipStatus } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Digital skills and smarter workflows.",
    icon: "💻",
  },
  {
    name: "Artificial intelligence",
    slug: "ai",
    description: "Practical AI for everyday work.",
    icon: "✦",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Make focused progress each day.",
    icon: "✓",
  },
  {
    name: "Career",
    slug: "career",
    description: "Build skills that move you forward.",
    icon: "↗",
  },
  {
    name: "Business",
    slug: "business",
    description: "Clear ideas for growing ventures.",
    icon: "▣",
  },
  {
    name: "Money",
    slug: "money",
    description: "Better habits around personal finance.",
    icon: "◈",
  },
];
const seed = async () => {
  for (const category of categories)
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  const tech = await prisma.category.findUniqueOrThrow({
    where: { slug: "technology" },
  });
  const ai = await prisma.category.findUniqueOrThrow({ where: { slug: "ai" } });
  const productivity = await prisma.category.findUniqueOrThrow({
    where: { slug: "productivity" },
  });
  const career = await prisma.category.findUniqueOrThrow({
    where: { slug: "career" },
  });
  const business = await prisma.category.findUniqueOrThrow({
    where: { slug: "business" },
  });
  const tips = [
    {
      slug: "make-ai-your-second-draft",
      title: "Use AI as your second draft, not your first thought",
      excerpt:
        "A simple way to use generative AI while keeping your own judgment in the work.",
      content:
        "Start by writing your raw idea, outline, or solution in your own words. Then ask an AI tool to identify gaps, offer alternatives, or improve clarity. This keeps you in charge of the thinking while using the tool for useful feedback.\n\nBefore sharing the result, verify important claims and make sure the final voice still sounds like you.",
      categoryId: ai.id,
      isFeatured: true,
      viewCount: 1248,
    },
    {
      slug: "the-two-minute-reset",
      title: "The two-minute reset that protects your focus",
      excerpt:
        "When your attention drifts, use a tiny reset instead of forcing a long session.",
      content:
        "Close the unrelated tabs. Take two minutes to name the next visible action. Then set a short timer and begin. A reset works because it removes the decision friction that makes distracted work feel heavy.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 938,
    },
    {
      slug: "learn-one-shortcut",
      title: "Learn one shortcut for the task you repeat most",
      excerpt:
        "A small automation habit compounds faster than hunting for the perfect tool.",
      content:
        "Notice one action you repeat every day: formatting text, switching windows, writing an email, or finding a file. Learn the shortcut or create a template for it. Reclaiming even a few seconds at a time adds up over a year.",
      categoryId: tech.id,
      isFeatured: false,
      viewCount: 781,
    },
    {
      slug: "better-questions",
      title: "Ask better questions before you search",
      excerpt: "A specific question produces information you can actually use.",
      content:
        "Replace broad searches with a clear outcome, constraint, and context. For example, ask how to prepare a three-minute project update for a non-technical audience. Better inputs reduce noise and help you compare trustworthy answers.",
      categoryId: ai.id,
      isFeatured: false,
      viewCount: 652,
    },
    {
      slug: "protect-your-calendar",
      title: "Protect one focus block before filling your calendar",
      excerpt:
        "Treat focused work as a commitment, not the empty space between meetings.",
      content:
        "Look at tomorrow before anyone else can fill it. Reserve one realistic block for the task that matters most, then add a precise outcome to its title. Even a 30-minute protected block can turn a vague priority into completed work.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 590,
    },
    {
      slug: "read-the-permission",
      title: "Read the permission before you t>ap allow",
      excerpt:
        "A permission request should make sense for the feature you are using.",
      content:
        "Before allowing a permission, ask what feature needs it and whether it is necessary right now. You can often grant access later from device settings. This small pause helps you keep control of your digital privacy.",
      categoryId: tech.id,
      isFeatured: false,
      viewCount: 544,
    },
    {
      slug: "ai-output-needs-checking",
      title: "AI output still needs a source check",
      excerpt: "Fast summaries are useful, but they are not proof.",
      content:
        "When an AI answer includes an important number, recommendation, quote, or policy claim, open the original source. Check the date and context. Treat generative output as a starting point for research, not a substitute for it.",
      categoryId: ai.id,
      isFeatured: false,
      viewCount: 503,
    },
    {
      slug: "write-a-better-status-update",
      title: "Write a status update that earns trust",
      excerpt: "A clear update answers progress, risk, and what happens next.",
      content:
        "Use three short parts: what changed, what is blocked, and the next action. Avoid a long chronology. People can make better decisions when the current state and the needed help are obvious.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 462,
    },
    {
      slug: "make-your-files-findable",
      title: "Name files so future you can find them",
      excerpt: "Use a predictable name before your folders become a maze.",
      content:
        "Start filenames with a date only when time matters, then add a short project name and a clear version. Avoid final-final-v2. A consistent naming habit lets search work for you instead of against you.",
      categoryId: tech.id,
      isFeatured: false,
      viewCount: 421,
    },
    {
      slug: "learn-in-public-carefully",
      title: "Share what you are learning, not what you are guessing",
      excerpt:
        "Teaching a new idea helps it stick when you are clear about your confidence.",
      content:
        "Write a short note about what you tried, what worked, and what remains uncertain. Link to a source when possible. This builds a useful record and invites corrections without presenting early learning as fact.",
      categoryId: ai.id,
      isFeatured: false,
      viewCount: 398,
    },
    {
      slug: "the-smallest-next-step",
      title: "Choose the smallest next step when a task feels heavy",
      excerpt: "Momentum is easier when the next move is visible and specific.",
      content:
        "Instead of planning the whole project, name a five-minute action: open the document, list three questions, or send one request. Once movement starts, the next step is usually easier to see.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 367,
    },
    {
      slug: "update-your-tools",
      title: "Update tools before troubleshooting everything else",
      excerpt:
        "Many small software issues disappear with a current, supported version.",
      content:
        "Check whether the operating system, browser, or app has a pending update. Read the release notes when a change affects your workflow. Keep a backup before major upgrades and avoid installing software from untrusted sites.",
      categoryId: tech.id,
      isFeatured: false,
      viewCount: 349,
    },
    {
      slug: "ask-for-feedback-early",
      title: "Ask for feedback when a draft is still easy to change",
      excerpt:
        "Early feedback is cheaper than a perfect-looking wrong direction.",
      content:
        "Show a rough outline or first screen to one relevant person. Ask a focused question: Is this clear? Does it solve the right problem? Use feedback to improve the direction before investing in polish.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 321,
    },
    {
      slug: "compare-tools-by-workflow",
      title: "Compare tools by your workflow, not their feature list",
      excerpt:
        "The best tool is often the one that removes the most friction from a real task.",
      content:
        "List the job you need to do, the devices you use, and the people you collaborate with. Test one small workflow end to end. Feature lists can look impressive while missing the step that matters to you.",
      categoryId: tech.id,
      isFeatured: false,
      viewCount: 298,
    },
    {
      slug: "save-a-decision-log",
      title: "Keep a small decision log for complex work",
      excerpt: "A sentence about why you chose a path can save hours later.",
      content:
        "Record the decision, the reason, and any assumption that could change. Keep it near the project. When a question returns, you have useful context instead of relying on memory or reopening old discussions.",
      categoryId: productivity.id,
      isFeatured: false,
      viewCount: 276,
    },
    {
      slug: "build-a-proof-of-work",
      title: "Build proof of work before you need it",
      excerpt:
        "Small examples of your skills make future opportunities easier to pursue.",
      content:
        "Keep a simple record of finished projects, useful notes, and problems you solved. Focus on what you did and what changed. A real example is more useful than trying to remember everything when an opportunity appears.",
      categoryId: career.id,
      isFeatured: false,
      viewCount: 255,
    },
    {
      slug: "test-the-small-offer",
      title: "Test the smallest version of an offer",
      excerpt:
        "Learn from a real customer need before investing in a large launch.",
      content:
        "Describe the outcome you can help with and share it with a small relevant audience. Listen for questions, not only compliments. A small test can reveal what people value and what needs refinement.",
      categoryId: business.id,
      isFeatured: false,
      viewCount: 239,
    },
    {
      slug: "prepare-for-a-good-meeting",
      title: "Prepare one decision for every meeting",
      excerpt: "Meetings work better when everyone knows what must be decided.",
      content:
        "Before a meeting, write the decision, the context needed, and who should be there. Send materials early enough to read. End by recording the decision and owner of the next action.",
      categoryId: career.id,
      isFeatured: false,
      viewCount: 224,
    },
    {
      slug: "measure-before-you-optimise",
      title: "Measure the problem before you optimize it",
      excerpt: "A quick baseline tells you whether a change genuinely helped.",
      content:
        "Write down the current time, error rate, cost, or user outcome. Make one intentional change, then compare it with the baseline. This prevents busy work that feels productive but does not improve the result.",
      categoryId: business.id,
      isFeatured: false,
      viewCount: 207,
    },
  ];
  for (const tip of tips)
    await prisma.tip.upsert({
      where: { slug: tip.slug },
      update: { ...tip, status: TipStatus.PUBLISHED, publishedAt: new Date() },
      create: { ...tip, status: TipStatus.PUBLISHED, publishedAt: new Date() },
    });
};
seed().finally(() => prisma.$disconnect());
