import { expect, test } from "@playwright/test";

test.describe("ホームページ", () => {
  test("初期表示とアニメーション", async ({ page }) => {
    await page.goto("/");

    // ヒーローセクションの表示確認
    const hero = page.getByText("Build Amazing Apps");
    await expect(hero).toBeVisible();

    // サブタイトルの表示確認
    const subtitle = page.getByText(
      "モダンなWeb開発のためのスターターテンプレート。"
    );
    await expect(subtitle).toBeVisible();

    // テーマ切り替えボタンの表示確認
    const themeButton = page.getByRole("button", {
      name: "テーマを切り替える",
    });
    await expect(themeButton).toBeVisible();

    // アニメーションの完了を待機
    await page.waitForTimeout(1000); // 初期アニメーションの完了を待つ
  });

  test("テーマ切り替え機能", async ({ page }) => {
    await page.goto("/");

    // デフォルトはライトテーマ
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // テーマ切り替えボタンをクリック
    const themeButton = page.getByRole("button", {
      name: "テーマを切り替える",
    });
    await themeButton.click();

    // ダークテーマに切り替わったことを確認
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("タブの切り替えとコンテンツ表示", async ({ page }) => {
    await page.goto("/");

    // Featuresタブの確認
    await expect(page.getByRole("tab", { name: "Features" })).toBeVisible();
    await expect(page.getByText("PWA Ready")).toBeVisible();
    await expect(page.getByText("High Performance")).toBeVisible();
    await expect(page.getByText("Beautiful UI")).toBeVisible();

    // Tech Stackタブに切り替え
    await page.getByRole("tab", { name: "Tech Stack" }).click();
    await expect(page.getByText("フロントエンド")).toBeVisible();
    await expect(page.getByText("開発ツール")).toBeVisible();
  });

  // Note: HoverCardのテストは現時点では実装しない
  // 理由：
  // 1. アニメーションとの相互作用が複雑
  // 2. モバイルではホバーが機能しない
  // 3. 実装の詳細に依存しすぎるテストになりやすい

  test("レスポンシブ対応", async ({ page }) => {
    // モバイルビュー
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // フィーチャーカードが1列になっていることを確認
    const featureCards = page.locator(".grid-cols-1");
    await expect(featureCards).toBeVisible();

    // デスクトップビュー
    await page.setViewportSize({ width: 1280, height: 800 });

    // フィーチャーカードが3列になっていることを確認
    const desktopFeatureCards = page.locator(".md\\:grid-cols-3");
    await expect(desktopFeatureCards).toBeVisible();
  });
});
