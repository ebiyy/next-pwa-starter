import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { apiClient } from "@/lib/api-client";
import { cache } from "@/lib/cache";
import {
  cleanupTestDatabase,
  setupTestDatabase,
} from "../helpers/setup-test-db";

describe("キャッシュ戦略のパフォーマンス検証", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test("キャッシュの有無によるレスポンスタイムの比較", async () => {
    // キャッシュクリア
    await cache.clear();

    // キャッシュなしの場合の測定
    const startWithoutCache = performance.now();
    const resultWithoutCache = await apiClient.getTechStacks();
    const timeWithoutCache = performance.now() - startWithoutCache;

    // キャッシュクリア
    await cache.clear();

    // 1回目のリクエスト（キャッシュ作成）
    await apiClient.getTechStacks();

    // キャッシュありの場合の測定
    const startWithCache = performance.now();
    const resultWithCache = await apiClient.getTechStacks();
    const timeWithCache = performance.now() - startWithCache;

    console.log(`キャッシュなし: ${timeWithoutCache}ms`);
    console.log(`キャッシュあり: ${timeWithCache}ms`);

    expect(timeWithCache).toBeLessThan(timeWithoutCache);
    expect(resultWithCache).toEqual(resultWithoutCache);
  });

  test("並列リクエスト時のキャッシュ効果", async () => {
    const ITERATIONS = 3;
    let totalTimeWithoutCache = 0;
    let totalTimeWithCache = 0;

    for (let i = 0; i < ITERATIONS; i++) {
      // キャッシュクリア
      await cache.clear();

      // 並列リクエストの実行（キャッシュなし）
      const startParallelWithoutCache = performance.now();
      await Promise.all([
        apiClient.getTechStacks(),
        apiClient.getFeatures(),
        apiClient.getChangelogs(),
      ]);
      const timeParallelWithoutCache =
        performance.now() - startParallelWithoutCache;

      // キャッシュクリア
      await cache.clear();

      // キャッシュの作成
      await Promise.all([
        apiClient.getTechStacks(),
        apiClient.getFeatures(),
        apiClient.getChangelogs(),
      ]);

      // 並列リクエストの実行（キャッシュあり）
      const startParallelWithCache = performance.now();
      await Promise.all([
        apiClient.getTechStacks(),
        apiClient.getFeatures(),
        apiClient.getChangelogs(),
      ]);
      const timeParallelWithCache = performance.now() - startParallelWithCache;

      totalTimeWithoutCache += timeParallelWithoutCache;
      totalTimeWithCache += timeParallelWithCache;

      console.log("\n実行 " + (i + 1) + "/" + ITERATIONS + ":");
      console.log(
        `並列実行（キャッシュなし）: ${timeParallelWithoutCache.toFixed(2)}ms`
      );
      console.log(
        `並列実行（キャッシュあり）: ${timeParallelWithCache.toFixed(2)}ms`
      );
    }

    const avgTimeWithoutCache = totalTimeWithoutCache / ITERATIONS;
    const avgTimeWithCache = totalTimeWithCache / ITERATIONS;

    console.log(`\n平均実行時間:`);
    console.log(
      `並列実行（キャッシュなし）: ${avgTimeWithoutCache.toFixed(2)}ms`
    );
    console.log(`並列実行（キャッシュあり）: ${avgTimeWithCache.toFixed(2)}ms`);

    // キャッシュありの場合が20%以上速いことを期待
    expect(avgTimeWithCache).toBeLessThan(avgTimeWithoutCache * 0.8);
  });
});
