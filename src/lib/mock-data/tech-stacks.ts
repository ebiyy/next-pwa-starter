import type { TechStack } from "@/types/schema";

export const techStacksData: TechStack[] = [
  {
    id: 1,
    name: "Next.js",
    category: "frontend",
    description: "The React Framework for Production",
    doc_url: "https://nextjs.org/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "shadcn/ui",
    category: "frontend",
    description:
      "Beautifully designed components built with Radix UI and Tailwind CSS",
    doc_url: "https://ui.shadcn.com",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Supabase",
    category: "backend",
    description: "Open source Firebase alternative",
    doc_url: "https://supabase.com/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Hono",
    category: "backend",
    description: "Ultrafast web framework for the Edges",
    doc_url: "https://hono.dev",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Bun",
    category: "tooling",
    description: "All-in-one JavaScript runtime & toolkit",
    doc_url: "https://bun.sh/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Biome",
    category: "tooling",
    description: "Toolchain for web projects",
    doc_url: "https://biomejs.dev/",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 7,
    name: "Playwright",
    category: "testing",
    description: "Reliable end-to-end testing for modern web apps",
    doc_url: "https://playwright.dev",
    created_at: "2025-01-01T00:00:00Z",
  },
];
