import { changelogsData } from "../../src/lib/mock-data/changelogs";
import { featuresData } from "../../src/lib/mock-data/features";
import { techStacksData } from "../../src/lib/mock-data/tech-stacks";
import { describe, expect, setupTest, test } from "../config/bun-test";
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

setupTest();

describe("モックデータ", () => {
  test("技術スタックのデータが存在する", () => {
    expect(techStacksData.length).toBeGreaterThan(0);
    expect(techStacksData[0]).toHaveProperty("name");
    expect(techStacksData[0]).toHaveProperty("category");
  });

  test("機能のデータが存在する", () => {
    expect(featuresData.length).toBeGreaterThan(0);
    expect(featuresData[0]).toHaveProperty("title");
    expect(featuresData[0]).toHaveProperty("description");
  });

  test("変更履歴のデータが存在する", () => {
    expect(changelogsData.length).toBeGreaterThan(0);
    expect(changelogsData[0]).toHaveProperty("version");
    expect(changelogsData[0]).toHaveProperty("description");
  });
});

describe("ファクトリー", () => {
  test("技術スタックファクトリーが動作する", () => {
    const techStack = createTechStack();
    expect(techStack).toHaveProperty("name");
    expect(techStack).toHaveProperty("category");

    const techStacks = createTechStackList(3);
    expect(techStacks).toHaveLength(3);

    const presetTechStack = createTechStack(techStackPresets.frontend);
    expect(presetTechStack.category).toBe("frontend");
  });

  test("機能ファクトリーが動作する", () => {
    const feature = createFeature();
    expect(feature).toHaveProperty("title");
    expect(feature).toHaveProperty("description");

    const features = createFeatureList(3);
    expect(features).toHaveLength(3);

    const presetFeature = createFeature(featurePresets.pwa);
    expect(presetFeature.icon_name).toBe("smartphone");
  });

  test("変更履歴ファクトリーが動作する", () => {
    const changelog = createChangelog();
    expect(changelog).toHaveProperty("version");
    expect(changelog).toHaveProperty("description");

    const changelogs = createChangelogList(3);
    expect(changelogs).toHaveLength(3);

    const presetChangelog = createChangelog(changelogPresets.majorRelease);
    expect(presetChangelog.is_major).toBe(true);
  });
});
