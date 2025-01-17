import type { Changelog } from "@/types/schema";
import { faker } from "@faker-js/faker";

type PartialChangelog = Partial<Changelog>;

const defaultValues = (): Changelog => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  version: faker.system.semver(),
  description: faker.git.commitMessage(),
  release_date: faker.date.recent().toISOString(),
  is_major: faker.datatype.boolean(),
});

export const buildChangelog = (override: PartialChangelog = {}): Changelog => ({
  ...defaultValues(),
  ...override,
});

export const buildChangelogList = (
  count: number,
  override: PartialChangelog = {}
): Changelog[] => Array.from({ length: count }, () => buildChangelog(override));
