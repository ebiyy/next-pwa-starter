import { cache } from "@/lib/cache";
import { changelogsData, featuresData, techStacksData } from "@/lib/mock-data";
import type {
  Changelog,
  Feature,
  TechStack,
  TechStackCategory,
} from "@/types/schema";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { handle } from "hono/vercel";
import { z } from "zod";

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
  const cached = await cache.get("features");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("features", JSON.stringify(featuresData), 60);
  return c.json(featuresData);
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
  const cached = await cache.get("changelogs");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("changelogs", JSON.stringify(changelogsData), 60);
  return c.json(changelogsData);
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
  const cached = await cache.get("tech_stacks");
  if (cached) {
    return c.json(JSON.parse(cached));
  }
  await cache.set("tech_stacks", JSON.stringify(techStacksData), 60);
  return c.json(techStacksData);
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
  const cacheKey = `tech_stacks_${category}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const filteredStacks = techStacksData.filter(
    (stack: TechStack) => stack.category === category
  );
  await cache.set(cacheKey, JSON.stringify(filteredStacks), 60);
  return c.json(filteredStacks);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
