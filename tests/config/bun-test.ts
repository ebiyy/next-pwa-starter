/// <reference types="bun-types" />

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCacheKey } from "@/lib/test-utils";

// グローバル設定
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// シャーディング設定
interface ShardConfig {
  shardId: number;
  totalShards: number;
}

export const getShardConfig = (): ShardConfig | null => {
  const shardId = Number(process.env.SHARD_ID);
  const totalShards = Number(process.env.TOTAL_SHARDS);

  if (
    !Number.isNaN(shardId) &&
    !Number.isNaN(totalShards) &&
    shardId >= 0 &&
    totalShards > 0 &&
    shardId < totalShards
  ) {
    return { shardId, totalShards };
  }
  return null;
};

// キャッシュ設定
export const CACHE_TTL = 1000 * 60 * 5; // 5分（テスト用にexport）
const testCache = new Map<string, { data: unknown; timestamp: number }>();

// テスト用のキャッシュクリア関数
export const clearTestCache = () => {
  testCache.clear();
};

// リソース使用の最適化
interface Resource<T> {
  value: T;
  timestamp: number;
}

const resourcePool = new Map<string, Resource<unknown>>();

export const acquireResource = async <T>(
  key: string,
  factory: () => Promise<T>
): Promise<T> => {
  if (!resourcePool.has(key)) {
    resourcePool.set(key, {
      value: await factory(),
      timestamp: Date.now(),
    });
  }
  const resource = resourcePool.get(key) as Resource<T>;
  return resource.value;
};

export const releaseResource = (key: string): void => {
  resourcePool.delete(key);
};

// テスト環境変数の読み込み
const loadTestEnv = (): boolean => {
  if (process.env.NODE_ENV !== "test") {
    return false;
  }

  try {
    const envPath = resolve(process.cwd(), ".env.test");
    const envContent = readFileSync(envPath, "utf-8");
    const envVars = Object.fromEntries(
      envContent
        .split("\n")
        .filter(Boolean)
        .filter((line) => !line.startsWith("#"))
        .map((line) => line.split("=").map((part) => part.trim()))
        .filter((parts) => parts.length === 2)
    );

    Object.assign(process.env, envVars);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error loading .env.test:", error.message);
      throw new Error(".env.test file is required for running tests");
    }
    throw error;
  }
};

// スナップショット設定の管理
interface SnapshotConfig {
  shouldUpdate: boolean;
  shouldIgnore: boolean;
}

let snapshotConfig: SnapshotConfig = {
  shouldUpdate: process.env.UPDATE_SNAPSHOTS === "true",
  shouldIgnore: process.env.IGNORE_SNAPSHOTS === "true",
};

export const updateSnapshotConfig = (config: Partial<SnapshotConfig>) => {
  snapshotConfig = { ...snapshotConfig, ...config };
};

export const getSnapshotConfig = (): SnapshotConfig => ({ ...snapshotConfig });

// テストセットアップのユーティリティ
const setupState = new WeakMap<object, boolean>();

export const setupTest = (context: object = {}) => {
  if (setupState.get(context)) {
    return;
  }

  const setup = () => {
    // テスト前の共通セットアップ
    process.env.NEXT_PUBLIC_TEST_MODE = "true";
    loadTestEnv();

    // シャーディング設定の適用（一度だけログ出力）
    const shardConfig = getShardConfig();
    if (shardConfig) {
      console.log(
        `Running tests for shard ${shardConfig.shardId + 1}/${
          shardConfig.totalShards
        }`
      );
    }
  };

  const cleanup = () => {
    // テスト後のクリーンアップ
    testCache.clear();
    resourcePool.clear();
    // スナップショット設定をリセット
    updateSnapshotConfig({
      shouldUpdate: process.env.UPDATE_SNAPSHOTS === "true",
      shouldIgnore: process.env.IGNORE_SNAPSHOTS === "true",
    });
  };

  setup();
  setupState.set(context, true);

  beforeAll(() => {
    // beforeAllでは環境変数の再設定は行わない
  });

  afterAll(() => {
    cleanup();
    setupState.delete(context);
  });
};

// パラメータのバリデーション
const validateCacheParams = (
  key: string,
  params: Record<string, unknown>
): void => {
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error("Cache key must be a non-empty string");
  }
  if (typeof params !== "object" || params === null) {
    throw new Error("Cache params must be an object");
  }
};

// キャッシュユーティリティ
export const withCache = async <T>(
  key: string,
  params: Record<string, unknown>,
  fn: () => Promise<T>
): Promise<T> => {
  try {
    validateCacheParams(key, params);
    const cacheKey = createCacheKey(key, params);
    const cached = testCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }

    const data = await fn();
    if (data === undefined) {
      throw new Error("Cache function returned undefined");
    }

    testCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cache error: ${error.message}`);
    }
    throw error;
  }
};

// スナップショットユーティリティ
export const updateSnapshots = (): boolean => snapshotConfig.shouldUpdate;
export const ignoreSnapshots = (): boolean => snapshotConfig.shouldIgnore;

// テストの並列実行用ユーティリティ
export const shouldRunTest = (testId: string): boolean => {
  const shardConfig = getShardConfig();
  if (!shardConfig) return true;

  const hash = Array.from(testId).reduce(
    (acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0,
    0
  );
  return Math.abs(hash) % shardConfig.totalShards === shardConfig.shardId;
};

export { expect, test, describe };
