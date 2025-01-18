#!/usr/bin/env bun
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface BadgeInfo {
  url: string;
  score: number;
}

const generateBadges = async () => {
  try {
    // Lighthouseの結果ファイルを読み込み
    // Lighthouse CIの結果ファイルを探す
    const lighthouseDir = join(process.cwd(), ".lighthouseci");
    const files = readdirSync(lighthouseDir);
    const lhrFile = files.find(
      (file) => file.endsWith(".json") && !file.includes("manifest")
    );
    if (!lhrFile) {
      throw new Error("No Lighthouse report found");
    }
    const lhrPath = join(lighthouseDir, lhrFile);
    const lhr = JSON.parse(readFileSync(lhrPath, "utf8"));
    console.log("Lighthouse report structure:", JSON.stringify(lhr, null, 2));

    // スコアの抽出（エラーハンドリングを追加）
    const scores: Record<string, number> = {};

    if (lhr.categories) {
      if (lhr.categories.performance?.score) {
        scores.performance = Math.round(lhr.categories.performance.score * 100);
      }
      if (lhr.categories.accessibility?.score) {
        scores.accessibility = Math.round(
          lhr.categories.accessibility.score * 100
        );
      }
      if (lhr.categories["best-practices"]?.score) {
        scores.bestPractices = Math.round(
          lhr.categories["best-practices"].score * 100
        );
      }
      if (lhr.categories.seo?.score) {
        scores.seo = Math.round(lhr.categories.seo.score * 100);
      }
    }

    if (Object.keys(scores).length === 0) {
      throw new Error("No valid scores found in Lighthouse report");
    }

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

      const badgeUrl = `https://img.shields.io/badge/${category}-${score}%25-${color}`;
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
