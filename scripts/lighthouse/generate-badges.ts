#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface LighthouseScore {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    "best-practices": { score: number };
    seo: { score: number };
  };
}

interface BadgeInfo {
  url: string;
  score: number;
}

const generateBadges = async () => {
  try {
    // Lighthouseの結果ファイルを読み込み
    const lhrPath = join(process.cwd(), ".lighthouseci", "lhr.json");
    const lhr = JSON.parse(readFileSync(lhrPath, "utf8")) as LighthouseScore;

    // スコアの抽出
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories["best-practices"].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
    };

    // バッジ保存ディレクトリの作成
    const badgesDir = join(process.cwd(), ".github", "badges");
    mkdirSync(badgesDir, { recursive: true });

    // バッジの生成と保存
    const entries = Object.entries(scores);
    for (const [category, score] of entries) {
      const color =
        score >= 90
          ? "brightgreen"
          : score >= 80
            ? "green"
            : score >= 70
              ? "yellow"
              : "red";

      const badgeUrl = `https://img.shields.io/badge/${category}-${score}-${color}`;
      const badgeInfo: BadgeInfo = { url: badgeUrl, score };

      // バッジ情報をJSONとして保存
      writeFileSync(
        join(badgesDir, `${category}.json`),
        JSON.stringify(badgeInfo, null, 2)
      );
    }

    console.log("✅ Lighthouse badges generated successfully");
  } catch (error) {
    console.error("❌ Error generating Lighthouse badges:", error);
    process.exit(1);
  }
};

generateBadges().catch(console.error);
