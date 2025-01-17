import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

interface TestTiming {
  testName: string;
  duration: number;
  suite: string;
}

let timings: TestTiming[] = [];
let suiteStartTime: number | undefined;
let currentSuite: string | undefined;

/**
 * テスト用の内部状態リセット関数
 */
export const resetForTesting = () => {
  timings = [];
  suiteStartTime = undefined;
  currentSuite = undefined;
};

export const startSuite = (suiteName: string) => {
  currentSuite = suiteName;
  suiteStartTime = performance.now();
};

export const recordTestTiming = (testName: string) => {
  if (!suiteStartTime || !currentSuite) {
    throw new Error("Suite must be started before recording test timing");
  }
  const endTime = performance.now();
  const duration = endTime - suiteStartTime;
  timings.push({
    testName,
    duration,
    suite: currentSuite,
  });
};

export const generateTimingReport = async () => {
  const totalDuration = timings.reduce((acc, curr) => acc + curr.duration, 0);
  const averageDuration =
    timings.length > 0 ? totalDuration / timings.length : 0;

  const suiteTimings = timings.reduce(
    (acc, { suite, duration }) => {
      if (!suite) return acc;
      acc[suite] = acc[suite] || { total: 0, count: 0 };
      acc[suite].total += duration;
      acc[suite].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );

  const report = {
    totalTests: timings.length,
    totalDuration: Math.round(totalDuration),
    averageDuration: Math.round(averageDuration),
    slowestTests: timings
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map(({ testName, duration, suite }) => ({
        testName,
        suite,
        duration: Math.round(duration),
      })),
    suiteBreakdown: Object.entries(suiteTimings).map(
      ([suite, { total, count }]) => ({
        suite,
        totalDuration: Math.round(total),
        averageDuration: Math.round(total / count),
      })
    ),
  };

  try {
    await writeFile(
      join(process.cwd(), "test-results", "timing-report.json"),
      JSON.stringify(report, null, 2)
    );
  } catch (error) {
    console.error("Failed to write timing report:", error);
  }

  return report;
};
