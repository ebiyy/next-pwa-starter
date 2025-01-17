/// <reference types="bun-types" />

import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  generateTimingReport,
  recordTestTiming,
  startSuite,
} from "../helpers/test-reporter";

// writeFileのモック化
const writeFileMock = mock(() => Promise.resolve());
mock.module("node:fs/promises", () => ({
  writeFile: writeFileMock,
}));

// process.cwdのモック化
const originalCwd = process.cwd;
process.cwd = () => "/test/path";

describe("test-reporter", () => {
  beforeEach(() => {
    // テストごとにモジュール内の状態をリセット
    import("../helpers/test-reporter").then((module) => {
      if ("resetForTesting" in module) {
        (module as { resetForTesting: () => void }).resetForTesting();
      }
    });
    // writeFileモックをリセット
    writeFileMock.mockClear();
  });

  describe("startSuite", () => {
    test("sets the current suite name", async () => {
      startSuite("example suite");
      recordTestTiming("test1");
      const report = await generateTimingReport();
      expect(report.suiteBreakdown[0].suite).toBe("example suite");
    });
  });

  describe("recordTestTiming", () => {
    test("throws error if suite is not started", () => {
      expect(() => recordTestTiming("test1")).toThrow(
        "Suite must be started before recording test timing"
      );
    });

    test("records test timing correctly", async () => {
      startSuite("suite1");
      recordTestTiming("test1");
      startSuite("suite2");
      recordTestTiming("test2");

      const report = await generateTimingReport();
      expect(report.totalTests).toBe(2);
      expect(report.suiteBreakdown).toHaveLength(2);
      expect(report.suiteBreakdown[0].suite).toBe("suite1");
      expect(report.suiteBreakdown[1].suite).toBe("suite2");
    });

    test("calculates duration correctly", async () => {
      startSuite("suite1");
      // 十分な時間を確保するために少し待機
      await new Promise((resolve) => setTimeout(resolve, 10));
      recordTestTiming("test1");
      const report = await generateTimingReport();
      expect(report.totalDuration).toBeGreaterThan(0);
      expect(report.averageDuration).toBeGreaterThan(0);
    });
  });

  describe("generateTimingReport", () => {
    test("generates report with empty timings", async () => {
      const report = await generateTimingReport();
      expect(report).toEqual({
        totalTests: 0,
        totalDuration: 0,
        averageDuration: 0,
        slowestTests: [],
        suiteBreakdown: [],
      });
    });

    test("identifies slowest tests correctly", async () => {
      startSuite("suite1");
      recordTestTiming("test1");
      await new Promise((resolve) => setTimeout(resolve, 100));
      recordTestTiming("test2");
      await new Promise((resolve) => setTimeout(resolve, 50));
      recordTestTiming("test3");

      const report = await generateTimingReport();
      expect(report.slowestTests).toHaveLength(3);
      expect(report.slowestTests[0].duration).toBeGreaterThan(
        report.slowestTests[1].duration
      );
    });

    test("writes report to file", async () => {
      startSuite("suite1");
      await new Promise((resolve) => setTimeout(resolve, 10));
      recordTestTiming("test1");
      await generateTimingReport();

      expect(writeFileMock).toHaveBeenCalledTimes(1);
      expect(writeFileMock).toHaveBeenCalledWith(
        join("/test/path", "test-results", "timing-report.json"),
        expect.any(String)
      );
    });

    test("handles multiple suites correctly", async () => {
      startSuite("suite1");
      await new Promise((resolve) => setTimeout(resolve, 10));
      recordTestTiming("test1");
      recordTestTiming("test2");
      startSuite("suite2");
      await new Promise((resolve) => setTimeout(resolve, 10));
      recordTestTiming("test3");

      const report = await generateTimingReport();
      expect(report.suiteBreakdown).toHaveLength(2);
      const [suite1, suite2] = report.suiteBreakdown;
      expect(suite1.suite).toBe("suite1");
      expect(suite2.suite).toBe("suite2");
      expect(suite1.averageDuration).toBeGreaterThan(0);
      expect(suite2.averageDuration).toBeGreaterThan(0);
    });

    test("rounds duration values in report", async () => {
      startSuite("suite1");
      await new Promise((resolve) => setTimeout(resolve, 10));
      recordTestTiming("test1");
      const report = await generateTimingReport();

      expect(Number.isInteger(report.slowestTests[0].duration)).toBe(true);
      expect(Number.isInteger(report.suiteBreakdown[0].totalDuration)).toBe(
        true
      );
      expect(Number.isInteger(report.suiteBreakdown[0].averageDuration)).toBe(
        true
      );
    });
  });

  // テスト終了後にprocess.cwdを元に戻す
  afterAll(() => {
    process.cwd = originalCwd;
  });
});
