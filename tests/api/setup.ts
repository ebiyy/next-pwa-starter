import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cache } from "@/lib/cache";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getShardConfig, withCache } from "../config/bun-test";

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
    release_date: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface APITestContext {
  app: Hono;
  baseUrl: string;
  server?: ReturnType<typeof serve>;
}

// シャードIDに基づいてポートを計算
const getPortForShard = (basePort: number): number => {
  const shardConfig = getShardConfig();
  if (!shardConfig) return basePort;
  return basePort + shardConfig.shardId;
};

/**
 * APIテスト用のセットアップ関数
 * @param options テストオプション
 */
export const setupAPITest = (
  options: {
    port?: number;
    prefix?: string;
  } = {}
) => {
  const { prefix = "/api" } = options;
  const port = getPortForShard(options.port ?? 3101);
  const app = new Hono().basePath(prefix);
  const baseUrl = `http://localhost:${port}${prefix}`;

  const context: APITestContext = {
    app,
    baseUrl,
  };

  // APIルートの定義
  app.get("/features", async (c) => {
    const cached = await cache.get("features");
    if (cached) {
      return c.json(JSON.parse(cached));
    }
    await cache.set("features", JSON.stringify(mockFeatures), 60);
    return c.json(mockFeatures);
  });

  app.get("/changelogs", async (c) => {
    const cached = await cache.get("changelogs");
    if (cached) {
      return c.json(JSON.parse(cached));
    }
    await cache.set("changelogs", JSON.stringify(mockChangelogs), 60);
    return c.json(mockChangelogs);
  });

  app.get("/tech-stacks", async (c) => {
    const cached = await cache.get("tech_stacks");
    if (cached) {
      return c.json(JSON.parse(cached));
    }
    await cache.set("tech_stacks", JSON.stringify(mockTechStacks), 60);
    return c.json(mockTechStacks);
  });

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

  beforeAll(async () => {
    context.server = serve({
      fetch: app.fetch,
      port,
    });
    console.log(`API Test Server running on port ${port}`);
  });

  afterAll(async () => {
    if (context.server) {
      context.server.close();
    }
  });

  return {
    context,
    describe,
    test,
    expect,
  };
};

/**
 * APIリクエストを実行する
 * @param url エンドポイントURL
 * @param options リクエストオプション
 */
export const request = async (
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    cache?: boolean;
  } = {}
) => {
  const { method = "GET", headers = {}, body, cache = true } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const makeRequest = async () => {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);
    return { response, data };
  };

  if (cache) {
    return withCache("api-request", { url, ...options }, makeRequest);
  }

  return makeRequest();
};

/**
 * APIレスポンスのアサーション
 */
export const assertResponse = {
  ok: (response: Response) => {
    expect(response.ok).toBe(true);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  },
  created: (response: Response) => {
    expect(response.status).toBe(201);
  },
  notFound: (response: Response) => {
    expect(response.status).toBe(404);
  },
  badRequest: (response: Response) => {
    expect(response.status).toBe(400);
  },
  unauthorized: (response: Response) => {
    expect(response.status).toBe(401);
  },
  forbidden: (response: Response) => {
    expect(response.status).toBe(403);
  },
};
