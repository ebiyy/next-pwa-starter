import type { TechStack, TechStackCategory } from "@/types/schema";
import { faker } from "@faker-js/faker";

const categories: TechStackCategory[] = [
  "frontend",
  "backend",
  "testing",
  "tooling",
];

export const techStackPresets = {
  frontend: {
    category: "frontend" as const,
    name: "Next.js",
    description: "The React Framework for Production",
    doc_url: "https://nextjs.org/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
  backend: {
    category: "backend" as const,
    name: "Supabase",
    description: "Open source Firebase alternative",
    doc_url: "https://supabase.com/docs",
    created_at: "2025-01-01T00:00:00Z",
  },
};

export const createTechStack = (
  override: Partial<TechStack> = {}
): TechStack => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.company.name(),
    category: faker.helpers.arrayElement(categories),
    description: faker.lorem.sentence(),
    doc_url: faker.internet.url(),
    created_at: faker.date.recent().toISOString(),
    ...override,
  };
};

export const createTechStackList = (
  count = 3,
  override: Partial<TechStack> = {}
): TechStack[] => {
  return Array.from({ length: count }, () => createTechStack(override));
};
