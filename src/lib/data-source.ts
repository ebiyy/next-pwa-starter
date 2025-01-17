import type { Changelog, Feature, TechStack } from "@/types/schema";

/**
 * データソースの基本操作を定義するインターフェース
 */
export interface DataSource {
  // Features
  getFeatures(): Promise<Feature[]>;
  getFeatureById(id: number): Promise<Feature | null>;
  createFeature(feature: Omit<Feature, "id" | "created_at">): Promise<Feature>;
  updateFeature(
    id: number,
    feature: Partial<Omit<Feature, "id" | "created_at">>
  ): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;

  // Changelogs
  getChangelogs(): Promise<Changelog[]>;
  getChangelogById(id: number): Promise<Changelog | null>;
  createChangelog(changelog: Omit<Changelog, "id">): Promise<Changelog>;
  updateChangelog(
    id: number,
    changelog: Partial<Omit<Changelog, "id">>
  ): Promise<Changelog>;
  deleteChangelog(id: number): Promise<void>;

  // TechStacks
  getTechStacks(): Promise<TechStack[]>;
  getTechStackById(id: number): Promise<TechStack | null>;
  createTechStack(
    techStack: Omit<TechStack, "id" | "created_at">
  ): Promise<TechStack>;
  updateTechStack(
    id: number,
    techStack: Partial<Omit<TechStack, "id" | "created_at">>
  ): Promise<TechStack>;
  deleteTechStack(id: number): Promise<void>;
}

/**
 * データソースの設定オプション
 */
export interface DataSourceOptions {
  /**
   * 環境設定（development, staging, production）
   */
  environment: "development" | "staging" | "production" | "test";

  /**
   * データベース接続URL（Supabase）
   */
  databaseUrl?: string;

  /**
   * Supabaseのアノニマスキー
   */
  supabaseAnonKey?: string;
}

/**
 * データソースのファクトリー関数の型定義
 */
export type DataSourceFactory = (
  options: DataSourceOptions
) => Promise<DataSource>;

/**
 * データソースプロバイダーの種類
 */
export type DataSourceProvider = "supabase";

/**
 * データソース初期化オプション
 */
export interface InitializeDataSourceOptions extends DataSourceOptions {
  provider: DataSourceProvider;
}

/**
 * グローバルデータソースインスタンス
 */
let globalDataSource: DataSource | null = null;

/**
 * データソースの初期化
 */
export async function initializeDataSource(
  options: InitializeDataSourceOptions
): Promise<DataSource> {
  const { provider, ...dataSourceOptions } = options;

  // Supabaseデータソースの初期化
  const { default: createSupabaseDataSource } = await import(
    "./data-sources/supabase.data-source"
  );
  const dataSource = await createSupabaseDataSource(dataSourceOptions);
  globalDataSource = dataSource;

  return dataSource;
}

/**
 * グローバルデータソースの取得
 */
export function getDataSource(): DataSource {
  if (!globalDataSource) {
    throw new Error(
      "DataSource has not been initialized. Call initializeDataSource first."
    );
  }
  return globalDataSource;
}
