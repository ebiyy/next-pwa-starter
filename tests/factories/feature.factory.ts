import type { Feature } from "@/types/schema";
import { faker } from "@faker-js/faker";

const iconNames = [
  "smartphone",
  "server",
  "shield-check",
  "database",
  "palette",
  "code",
  "settings",
  "cloud",
];

export const featurePresets = {
  pwa: {
    title: "PWA Support",
    description: "オフライン対応とインストール可能なウェブアプリケーション",
    icon_name: "smartphone",
    doc_url:
      "https://nextjs.org/docs/app/building-your-application/optimizing/static-assets",
  },
  serverComponents: {
    title: "Server Components",
    description: "高速なページロードとSEO対応のサーバーサイドレンダリング",
    icon_name: "server",
    doc_url:
      "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
  },
};

export const createFeature = (override: Partial<Feature> = {}): Feature => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    title: faker.helpers.fake("{{company.buzzNoun}} {{company.buzzVerb}}"),
    description: faker.lorem.sentence(),
    icon_name: faker.helpers.arrayElement(iconNames),
    doc_url: faker.internet.url(),
    created_at: faker.date.recent().toISOString(),
    ...override,
  };
};

export const createFeatureList = (
  count = 3,
  override: Partial<Feature> = {}
): Feature[] => {
  return Array.from({ length: count }, () => createFeature(override));
};
