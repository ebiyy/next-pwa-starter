import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  type InitializeDataSourceOptions,
  getDataSource,
  initializeDataSource,
} from "@/lib/data-source";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getShardConfig, withCache } from "../config/bun-test";

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

  // DataSourceの初期化
  const initializeTestDataSource = async () => {
    const options: InitializeDataSourceOptions = {
      provider: "supabase",
      environment: "test",
      databaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    await initializeDataSource(options);
  };

  // APIルートの定義
  app.get("/features", async (c) => {
    const dataSource = getDataSource();
    const features = await dataSource.getFeatures();
    return c.json(features);
  });

  app.get("/changelogs", async (c) => {
    const dataSource = getDataSource();
    const changelogs = await dataSource.getChangelogs();
    return c.json(changelogs);
  });

  app.get("/tech-stacks", async (c) => {
    const dataSource = getDataSource();
    const techStacks = await dataSource.getTechStacks();
    return c.json(techStacks);
  });

  app.get("/tech-stacks/:category", async (c) => {
    const category = c.req.param("category");
    const dataSource = getDataSource();
    const techStacks = await dataSource.getTechStacks();
    const filteredStacks = techStacks.filter(
      (stack) => stack.category === category
    );

    if (filteredStacks.length === 0) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json(filteredStacks);
  });

  beforeAll(async () => {
    await initializeTestDataSource();
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
