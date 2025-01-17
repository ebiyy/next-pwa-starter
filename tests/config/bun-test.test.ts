/// <reference types="bun-types" />

import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CACHE_TTL,
  clearTestCache,
  getSnapshotConfig,
  ignoreSnapshots,
  setupTest,
  updateSnapshotConfig,
  updateSnapshots,
  withCache,
} from "./bun-test";

// process.cwdのモック化
const originalCwd = process.cwd;
process.cwd = () => "/test/path";

describe("bun-test", () => {
  describe("setupTest", () => {
    const originalEnv = { ...process.env };
    const originalConsoleWarn = console.warn;
    let warnMock: ReturnType<typeof mock>;
    let readFileMock: ReturnType<typeof mock>;

    beforeEach(() => {
      // グローバル状態をリセット
      clearTestCache();

      // 環境変数をリセット
      process.env = { ...originalEnv };

      // モックをリセット
      warnMock = mock();
      console.warn = warnMock;

      // readFileSyncのモック化
      readFileMock = mock(
        () => "TEST_VAR=test_value\nANOTHER_VAR=another_value"
      );
      mock.module("node:fs", () => ({
        readFileSync: readFileMock,
      }));
    });

    afterAll(() => {
      console.warn = originalConsoleWarn;
      process.env = originalEnv;
    });

    test("sets up test environment correctly", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "test",
        configurable: true,
      });

      setupTest();

      expect(process.env.NEXT_PUBLIC_TEST_MODE).toBe("true");
      expect(process.env.TEST_VAR).toBe("test_value");
      expect(process.env.ANOTHER_VAR).toBe("another_value");
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(warnMock).not.toHaveBeenCalled();
    });

    test("handles missing .env.test file", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "test",
        configurable: true,
      });

      readFileMock.mockImplementation(() => {
        throw new Error("File not found");
      });

      setupTest();

      expect(warnMock).toHaveBeenCalledTimes(1);
      expect(warnMock).toHaveBeenCalledWith(
        "Warning: .env.test file not found"
      );
      expect(process.env.NEXT_PUBLIC_TEST_MODE).toBe("true");
    });

    test("skips env loading when not in test environment", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        configurable: true,
      });

      setupTest();

      expect(readFileMock).not.toHaveBeenCalled();
      expect(process.env.NEXT_PUBLIC_TEST_MODE).toBe("true");
      expect(warnMock).not.toHaveBeenCalled();
    });

    test("handles multiple setupTest calls", () => {
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "test",
        configurable: true,
      });

      setupTest();
      const firstCallCount = readFileMock.mock.calls.length;

      setupTest(); // 2回目の呼び出し
      expect(readFileMock.mock.calls.length).toBe(firstCallCount); // 追加の呼び出しがないことを確認
    });
  });

  describe("withCache", () => {
    beforeEach(() => {
      clearTestCache();
    });

    test("caches and returns data correctly", async () => {
      const mockFn = mock(() => Promise.resolve("test data"));

      // 初回実行
      const result1 = await withCache("test", { param: "value" }, mockFn);
      expect(result1).toBe("test data");
      expect(mockFn).toHaveBeenCalledTimes(1);

      // キャッシュからの取得
      const result2 = await withCache("test", { param: "value" }, mockFn);
      expect(result2).toBe("test data");
      expect(mockFn).toHaveBeenCalledTimes(1); // 関数は再実行されていない
    });

    test("regenerates cache after TTL", async () => {
      const mockFn = mock(() => Promise.resolve("test data"));
      const now = Date.now();
      const dateSpy = mock(() => now);
      const originalDateNow = Date.now;
      Date.now = dateSpy;

      // 初回実行
      const result1 = await withCache("test", { param: "value" }, mockFn);
      expect(result1).toBe("test data");
      expect(mockFn).toHaveBeenCalledTimes(1);

      // TTL経過後をシミュレート
      Date.now = mock(() => now + CACHE_TTL + 1000);

      // 再実行（キャッシュ期限切れ）
      const result2 = await withCache("test", { param: "value" }, mockFn);
      expect(result2).toBe("test data");
      expect(mockFn).toHaveBeenCalledTimes(2); // 関数が再実行された

      // クリーンアップ
      Date.now = originalDateNow;
    });

    test("handles different cache keys", async () => {
      const mockFn = mock(() => Promise.resolve("test data"));

      // 異なるキーでの実行
      await withCache("test1", { param: "value1" }, mockFn);
      await withCache("test2", { param: "value2" }, mockFn);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("validates cache key", async () => {
      const mockFn = mock(() => Promise.resolve("test data"));

      await expect(withCache("", { param: "value" }, mockFn)).rejects.toThrow(
        "Cache error: Cache key must be a non-empty string"
      );
    });

    test("validates cache params", async () => {
      const mockFn = mock(() => Promise.resolve("test data"));

      await expect(
        // @ts-expect-error: テストのために無効な型を渡す
        withCache("test", null, mockFn)
      ).rejects.toThrow("Cache error: Cache params must be an object");
    });

    test("handles undefined return value", async () => {
      const mockFn = mock(() => Promise.resolve(undefined));

      await expect(
        withCache("test", { param: "value" }, mockFn)
      ).rejects.toThrow("Cache error: Cache function returned undefined");
    });

    test("handles async errors", async () => {
      const mockError = new Error("Test error");
      const mockFn = mock(() => Promise.reject(mockError));

      await expect(
        withCache("test", { param: "value" }, mockFn)
      ).rejects.toThrow("Cache error: Test error");
    });
  });

  describe("snapshot settings", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
      updateSnapshotConfig({
        shouldUpdate: false,
        shouldIgnore: false,
      });
    });

    test("updateSnapshots reflects config changes", () => {
      updateSnapshotConfig({ shouldUpdate: true });
      expect(updateSnapshots()).toBe(true);

      updateSnapshotConfig({ shouldUpdate: false });
      expect(updateSnapshots()).toBe(false);
    });

    test("ignoreSnapshots reflects config changes", () => {
      updateSnapshotConfig({ shouldIgnore: true });
      expect(ignoreSnapshots()).toBe(true);

      updateSnapshotConfig({ shouldIgnore: false });
      expect(ignoreSnapshots()).toBe(false);
    });

    test("getSnapshotConfig returns current config", () => {
      updateSnapshotConfig({
        shouldUpdate: true,
        shouldIgnore: false,
      });

      const config = getSnapshotConfig();
      expect(config).toEqual({
        shouldUpdate: true,
        shouldIgnore: false,
      });
    });

    test("snapshot config is immutable", () => {
      updateSnapshotConfig({
        shouldUpdate: true,
        shouldIgnore: false,
      });

      const config = getSnapshotConfig();
      config.shouldUpdate = false; // 変更を試みる

      const newConfig = getSnapshotConfig();
      expect(newConfig.shouldUpdate).toBe(true); // 元の値が保持されている
    });
  });

  // テスト終了後に元の状態に戻す
  afterAll(() => {
    process.cwd = originalCwd;
  });
});
