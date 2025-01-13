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

    // バージョンバッジの表示確認
    const versionBadge = page.getByText("v1.0.0 Now Available");
    await expect(versionBadge).toBeVisible();

    // テーマ切り替えボタンの表示確認
    const themeButton = page.getByRole("button", {
      name: "テーマを切り替える",
    });
    await expect(themeButton).toBeVisible();

    // アニメーションの完了を待機
    await page.waitForTimeout(1000);
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

  test("フィーチャーとチェンジログの表示", async ({ page }) => {
    await page.goto("/");

    // Featuresセクションの確認
    await expect(page.getByRole("heading", { name: "Features" })).toBeVisible();
    await expect(page.getByText("Next.js 15")).toBeVisible();
    await expect(page.getByText("Supabase")).toBeVisible();
    await expect(page.getByText("PWA対応")).toBeVisible();

    // Changelogセクションの確認
    await expect(
      page.getByRole("heading", { name: "Changelog" })
    ).toBeVisible();
    await expect(page.getByText("2.0.0")).toBeVisible();
    await expect(page.getByText(/Next.js 15とTurbopackの統合/)).toBeVisible();
  });

  test("レスポンシブ対応", async ({ page }) => {
    // モバイルビュー
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // フィーチャーカードが1列になっていることを確認
    const featureCards = page.locator(".grid-cols-1");
    await expect(featureCards).toBeVisible();

    // タブレットビュー
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator(".md\\:grid-cols-2")).toBeVisible();

    // デスクトップビュー
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(".lg\\:grid-cols-3")).toBeVisible();
  });
});
