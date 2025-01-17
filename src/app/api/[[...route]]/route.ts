import { cache } from "@/lib/cache";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// モックデータ
const mockFeatures = [
  {
    id: 1,
    title: "Next.js 15",
    description:
      "App RouterとServer Componentsによる最新のReactアプリケーション開発",
    icon: "🚀",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Supabase",
    description: "オープンソースのFirebase代替。認証やデータベースを簡単に実装",
    icon: "🗄️",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "PWA対応",
    description: "Progressive Web Appとしてインストール可能",
    icon: "📱",
    created_at: new Date().toISOString(),
  },
];

const mockTechStacks = [
  {
    id: 1,
    name: "Next.js",
    description: "The React Framework for the Web",
    doc_url: "https://nextjs.org",
    category: "frontend",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Supabase",
    description: "Open source Firebase alternative",
    doc_url: "https://supabase.com",
    category: "backend",
    created_at: new Date().toISOString(),
  },
];

const mockChangelogs = [
  {
    id: 1,
    version: "1.0.0",
    description: "初期リリース",
    release_date: new Date().toISOString(),
  },
  {
    id: 2,
    version: "1.1.0",
    description: "PWA対応を追加",
    release_date: new Date(Date.now() - 86400000).toISOString(), // 1日前
  },
];

// Features
app.get("/features", async (c) => {
  const cached = await cache.get("features");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("features", JSON.stringify(mockFeatures), 60);
  return c.json(mockFeatures);
});

// Changelogs
app.get("/changelogs", async (c) => {
  const cached = await cache.get("changelogs");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("changelogs", JSON.stringify(mockChangelogs), 60);
  return c.json(mockChangelogs);
});

// Tech stacks
app.get("/tech-stacks", async (c) => {
  const cached = await cache.get("tech_stacks");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("tech_stacks", JSON.stringify(mockTechStacks), 60);
  return c.json(mockTechStacks);
});

// Tech stacks by category
app.get("/tech-stacks/:category", async (c) => {
  const category = c.req.param("category");
  const cacheKey = `tech_stacks_${category}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const filteredStacks = mockTechStacks.filter(
    (stack) => stack.category === category
  );
  await cache.set(cacheKey, JSON.stringify(filteredStacks), 60);
  return c.json(filteredStacks);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
