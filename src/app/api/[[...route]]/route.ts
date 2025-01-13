import { cache } from "@/lib/cache";
import { supabase } from "@/lib/supabase";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Features
app.get("/features", async (c) => {
  const cached = await cache.get("features");
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  await cache.set("features", JSON.stringify(data), 60); // 1分キャッシュ
  return c.json(data);
});

// Changelogs
app.get("/changelogs", async (c) => {
  const cached = await cache.get("changelogs");
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const { data, error } = await supabase
    .from("changelogs")
    .select("*")
    .order("release_date", { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  await cache.set("changelogs", JSON.stringify(data), 60); // 1分キャッシュ
  return c.json(data);
});

// Tech stacks
app.get("/tech-stacks", async (c) => {
  const cached = await cache.get("tech_stacks");
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  await cache.set("tech_stacks", JSON.stringify(data), 60); // 1分キャッシュ
  return c.json(data);
});

// Tech stacks by category
app.get("/tech-stacks/:category", async (c) => {
  const category = c.req.param("category");
  const cacheKey = `tech_stacks_${category}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: true });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  await cache.set(cacheKey, JSON.stringify(data), 60); // 1分キャッシュ
  return c.json(data);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
