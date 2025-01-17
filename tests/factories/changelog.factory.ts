import type { Changelog } from "@/types/schema";
import { faker } from "@faker-js/faker";

export const changelogPresets = {
  majorRelease: {
    version: "1.0.0",
    description: "初期リリース",
    is_major: true,
  },
  featureUpdate: {
    version: "1.1.0",
    description: "新機能の追加",
    is_major: false,
  },
};

const generateVersion = (): string => {
  const major = faker.number.int({ min: 0, max: 5 });
  const minor = faker.number.int({ min: 0, max: 9 });
  const patch = faker.number.int({ min: 0, max: 9 });
  return `${major}.${minor}.${patch}`;
};

export const createChangelog = (
  override: Partial<Changelog> = {}
): Changelog => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    version: generateVersion(),
    description: faker.git.commitMessage(),
    release_date: faker.date.recent().toISOString(),
    is_major: faker.datatype.boolean(),
    ...override,
  };
};

export const createChangelogList = (
  count = 3,
  override: Partial<Changelog> = {}
): Changelog[] => {
  return Array.from({ length: count }, () => createChangelog(override));
};
