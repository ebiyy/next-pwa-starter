import { type DataSource, initializeDataSource } from "@/lib/data-source";
import type { Changelog, Feature, TechStack } from "@/types/schema";

// WeakMapを使用してテストスイート毎にデータソースを管理
const dataSources = new WeakMap<object, DataSource>();
const contextKey = {};

/**
 * テスト用データソースの初期化
 */
export async function setupTestDatabase(): Promise<DataSource> {
  try {
    const existingDataSource = dataSources.get(contextKey);
    if (existingDataSource) {
      return existingDataSource;
    }

    const newDataSource = await initializeDataSource({
      provider: "supabase",
      environment: "test",
      databaseUrl: "http://127.0.0.1:54321",
      supabaseAnonKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    });

    dataSources.set(contextKey, newDataSource);
    return newDataSource;
  } catch (error) {
    console.error("Failed to setup test database:", error);
    throw error;
  }
}

/**
 * テストデータの初期状態
 */
const initialState = {
  features: [] as Feature[],
  changelogs: [] as Changelog[],
  techStacks: [] as TechStack[],
};

/**
 * テストデータのリセット
 */
export async function resetTestDatabase(): Promise<void> {
  try {
    const ds = await setupTestDatabase();

    // 既存のデータを全て削除
    const [features, changelogs, techStacks] = await Promise.all([
      ds.getFeatures(),
      ds.getChangelogs(),
      ds.getTechStacks(),
    ]);

    await Promise.all([
      ...features.map((f) => ds.deleteFeature(f.id)),
      ...changelogs.map((c) => ds.deleteChangelog(c.id)),
      ...techStacks.map((t) => ds.deleteTechStack(t.id)),
    ]);

    // 初期データの再投入
    await Promise.all([
      ...initialState.features.map((f) => ds.createFeature(f)),
      ...initialState.changelogs.map((c) => ds.createChangelog(c)),
      ...initialState.techStacks.map((t) => ds.createTechStack(t)),
    ]);
  } catch (error) {
    console.error("Failed to reset test database:", error);
    throw error;
  }
}

/**
 * テストデータの作成
 */
export async function createTestData(data: {
  features?: Omit<Feature, "id" | "created_at">[];
  changelogs?: Omit<Changelog, "id">[];
  techStacks?: Omit<TechStack, "id" | "created_at">[];
}): Promise<void> {
  try {
    const ds = await setupTestDatabase();

    await Promise.all([
      ...(data.features ?? []).map((f) => ds.createFeature(f)),
      ...(data.changelogs ?? []).map((c) => ds.createChangelog(c)),
      ...(data.techStacks ?? []).map((t) => ds.createTechStack(t)),
    ]);
  } catch (error) {
    console.error("Failed to create test data:", error);
    throw error;
  }
}

/**
 * テストデータの取得
 */
export async function getTestData() {
  try {
    const ds = await setupTestDatabase();

    const [features, changelogs, techStacks] = await Promise.all([
      ds.getFeatures(),
      ds.getChangelogs(),
      ds.getTechStacks(),
    ]);

    return {
      features,
      changelogs,
      techStacks,
    };
  } catch (error) {
    console.error("Failed to get test data:", error);
    throw error;
  }
}

/**
 * テストデータベースのクリーンアップ
 */
export async function cleanupTestDatabase(): Promise<void> {
  try {
    const ds = dataSources.get(contextKey);
    if (!ds) {
      return;
    }

    await resetTestDatabase();
    dataSources.delete(contextKey);
  } catch (error) {
    console.error("Failed to cleanup test database:", error);
    throw error;
  }
}
