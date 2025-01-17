import {
  type InitializeDataSourceOptions,
  getDataSource,
  initializeDataSource,
} from "@/lib/data-source";
import type { TechStackCategory } from "@/types/schema";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { z } from "zod";

// DataSourceの初期化
const initializeAPI = async () => {
  const options: InitializeDataSourceOptions = {
    provider: "supabase",
    environment:
      (process.env.NODE_ENV as "development" | "staging" | "production") ??
      "development",
    databaseUrl: process.env.SUPABASE_URL ?? "http://127.0.0.1:54321",
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  };

  await initializeDataSource(options);
};

const app = new OpenAPIHono().basePath("/api");

// スキーマ定義
const featureSchema = z.object({
  id: z.number().describe("Feature ID"),
  title: z.string().describe("Feature title"),
  description: z.string().describe("Feature description"),
  icon_name: z.string().describe("Feature icon name"),
  doc_url: z.string().describe("Documentation URL"),
  created_at: z.string().describe("Creation date"),
});

const changelogSchema = z.object({
  id: z.number().describe("Changelog ID"),
  version: z.string().describe("Version number"),
  description: z.string().describe("Change description"),
  release_date: z.string().describe("Release date"),
  is_major: z.boolean().describe("Is major release"),
});

const techStackCategorySchema = z.enum([
  "frontend",
  "backend",
  "testing",
  "tooling",
]);

const techStackSchema = z.object({
  id: z.number().describe("Tech stack ID"),
  name: z.string().describe("Tech stack name"),
  description: z.string().describe("Tech stack description"),
  doc_url: z.string().describe("Documentation URL"),
  category: techStackCategorySchema.describe("Tech stack category"),
  created_at: z.string().describe("Creation date"),
});

// OpenAPI設定
app.doc("/", {
  openapi: "3.0.0",
  info: {
    title: "Next PWA Starter API",
    version: "v1",
    description: "Next.js PWAスターターテンプレートのAPI",
  },
});

// Features
const getFeaturesRoute = createRoute({
  method: "get",
  path: "/features",
  responses: {
    200: {
      description: "List of features",
      content: {
        "application/json": {
          schema: z.array(featureSchema),
        },
      },
    },
  },
});

app.openapi(getFeaturesRoute, async (c) => {
  const dataSource = getDataSource();
  const features = await dataSource.getFeatures();
  return c.json(features);
});

// Changelogs
const getChangelogsRoute = createRoute({
  method: "get",
  path: "/changelogs",
  responses: {
    200: {
      description: "List of changelogs",
      content: {
        "application/json": {
          schema: z.array(changelogSchema),
        },
      },
    },
  },
});

app.openapi(getChangelogsRoute, async (c) => {
  const dataSource = getDataSource();
  const changelogs = await dataSource.getChangelogs();
  return c.json(changelogs);
});

// Tech stacks
const getTechStacksRoute = createRoute({
  method: "get",
  path: "/tech-stacks",
  responses: {
    200: {
      description: "List of tech stacks",
      content: {
        "application/json": {
          schema: z.array(techStackSchema),
        },
      },
    },
  },
});

app.openapi(getTechStacksRoute, async (c) => {
  const dataSource = getDataSource();
  const techStacks = await dataSource.getTechStacks();
  return c.json(techStacks);
});

// Tech stacks by category
const getTechStacksByCategoryRoute = createRoute({
  method: "get",
  path: "/tech-stacks/{category}",
  parameters: [
    {
      name: "category",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: ["frontend", "backend", "testing", "tooling"],
        description: "Tech stack category",
      },
    },
  ],
  responses: {
    200: {
      description: "List of tech stacks by category",
      content: {
        "application/json": {
          schema: z.array(techStackSchema),
        },
      },
    },
  },
});

app.openapi(getTechStacksByCategoryRoute, async (c) => {
  const category = c.req.param("category") as TechStackCategory;
  const dataSource = getDataSource();
  const techStacks = await dataSource.getTechStacks();
  const filteredStacks = techStacks.filter(
    (stack) => stack.category === category
  );
  return c.json(filteredStacks);
});

// DataSourceの初期化
await initializeAPI();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
