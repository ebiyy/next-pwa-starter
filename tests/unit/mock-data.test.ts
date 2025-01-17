import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import type { DataSource } from "@/lib/data-source";
import { setupTest } from "../config/bun-test";
import {
  changelogPresets,
  createChangelog,
  createChangelogList,
  createFeature,
  createFeatureList,
  createTechStack,
  createTechStackList,
  featurePresets,
  techStackPresets,
} from "../factories";
import {
  cleanupTestDatabase,
  createTestData,
  resetTestDatabase,
  setupTestDatabase,
} from "../helpers/setup-test-db";

setupTest();

let dataSource: DataSource;

beforeEach(async () => {
  dataSource = await setupTestDatabase();
  await resetTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

describe("データソース", () => {
  test("技術スタックのデータが取得できる", async () => {
    // テストデータの作成
    await createTestData({
      techStacks: [createTechStack()],
    });

    const techStacks = await dataSource.getTechStacks();
    expect(techStacks.length).toBeGreaterThan(0);
    expect(techStacks[0]).toHaveProperty("name");
    expect(techStacks[0]).toHaveProperty("category");
  });

  test("機能のデータが取得できる", async () => {
    await createTestData({
      features: [createFeature()],
    });

    const features = await dataSource.getFeatures();
    expect(features.length).toBeGreaterThan(0);
    expect(features[0]).toHaveProperty("title");
    expect(features[0]).toHaveProperty("description");
  });

  test("変更履歴のデータが取得できる", async () => {
    await createTestData({
      changelogs: [createChangelog()],
    });

    const changelogs = await dataSource.getChangelogs();
    expect(changelogs.length).toBeGreaterThan(0);
    expect(changelogs[0]).toHaveProperty("version");
    expect(changelogs[0]).toHaveProperty("description");
  });
});

describe("データ操作", () => {
  test("技術スタックのCRUD操作", async () => {
    // Create
    const newTechStack = await dataSource.createTechStack(
      createTechStack(techStackPresets.frontend)
    );
    expect(newTechStack.category).toBe("frontend");

    // Read
    const techStack = await dataSource.getTechStackById(newTechStack.id);
    expect(techStack).toBeDefined();
    expect(techStack?.name).toBe(newTechStack.name);

    // Update
    const updatedTechStack = await dataSource.updateTechStack(newTechStack.id, {
      description: "Updated description",
    });
    expect(updatedTechStack.description).toBe("Updated description");

    // Delete
    await dataSource.deleteTechStack(newTechStack.id);
    const deletedTechStack = await dataSource.getTechStackById(newTechStack.id);
    expect(deletedTechStack).toBeNull();
  });

  test("機能のCRUD操作", async () => {
    // Create
    const newFeature = await dataSource.createFeature(
      createFeature(featurePresets.pwa)
    );
    expect(newFeature.icon_name).toBe("smartphone");

    // Read
    const feature = await dataSource.getFeatureById(newFeature.id);
    expect(feature).toBeDefined();
    expect(feature?.title).toBe(newFeature.title);

    // Update
    const updatedFeature = await dataSource.updateFeature(newFeature.id, {
      description: "Updated description",
    });
    expect(updatedFeature.description).toBe("Updated description");

    // Delete
    await dataSource.deleteFeature(newFeature.id);
    const deletedFeature = await dataSource.getFeatureById(newFeature.id);
    expect(deletedFeature).toBeNull();
  });

  test("変更履歴のCRUD操作", async () => {
    // Create
    const newChangelog = await dataSource.createChangelog(
      createChangelog(changelogPresets.majorRelease)
    );
    expect(newChangelog.is_major).toBe(true);

    // Read
    const changelog = await dataSource.getChangelogById(newChangelog.id);
    expect(changelog).toBeDefined();
    expect(changelog?.version).toBe(newChangelog.version);

    // Update
    const updatedChangelog = await dataSource.updateChangelog(newChangelog.id, {
      description: "Updated description",
    });
    expect(updatedChangelog.description).toBe("Updated description");

    // Delete
    await dataSource.deleteChangelog(newChangelog.id);
    const deletedChangelog = await dataSource.getChangelogById(newChangelog.id);
    expect(deletedChangelog).toBeNull();
  });
});
