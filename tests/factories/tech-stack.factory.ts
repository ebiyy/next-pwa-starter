import type { TechStack, TechStackCategory } from "@/types/schema";
import { faker } from "@faker-js/faker";

type PartialTechStack = Partial<TechStack>;

const categories: TechStackCategory[] = [
  "frontend",
  "backend",
  "testing",
  "tooling",
];

const defaultValues = (): TechStack => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.helpers.arrayElement([
    "React",
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "Supabase",
    "Playwright",
  ]),
  category: faker.helpers.arrayElement(categories),
  description: faker.lorem.paragraph(),
  doc_url: faker.internet.url(),
  created_at: faker.date.recent().toISOString(),
});

export const buildTechStack = (override: PartialTechStack = {}): TechStack => ({
  ...defaultValues(),
  ...override,
});

export const buildTechStackList = (
  count: number,
  override: PartialTechStack = {}
): TechStack[] => Array.from({ length: count }, () => buildTechStack(override));
