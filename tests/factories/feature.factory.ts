import type { Feature } from "@/types/schema";
import { faker } from "@faker-js/faker";

type PartialFeature = Partial<Feature>;

const defaultValues = (): Feature => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  icon_name: faker.helpers.arrayElement(["rocket", "star", "zap", "code"]),
  doc_url: faker.internet.url(),
  created_at: faker.date.recent().toISOString(),
});

export const buildFeature = (override: PartialFeature = {}): Feature => ({
  ...defaultValues(),
  ...override,
});

export const buildFeatureList = (
  count: number,
  override: PartialFeature = {}
): Feature[] => Array.from({ length: count }, () => buildFeature(override));
