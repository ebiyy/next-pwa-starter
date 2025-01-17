import { expect, test } from "@playwright/test";
import { PageHelper } from "./helpers/pwa-helper";
import { waitForServer } from "./helpers/server-helper";

test.describe("ホームページ", () => {
  let pageHelper: PageHelper;

  test.beforeAll(async () => {
    // 開発サーバーの起動を待機
    await waitForServer({
      message: "Next.js開発サーバーの起動を待機中...",
      timeout: 60000, // 1分
    });
  });

  test.beforeEach(async ({ page }) => {
    pageHelper = new PageHelper(page);
    await pageHelper.goto();
  });

  test("初期表示とアニメーション", async () => {
    const hero = await pageHelper.getHeroSection();

    // ヒーローセクションの表示確認
    expect(await hero.title.isVisible()).toBe(true);
    expect(await hero.subtitle.isVisible()).toBe(true);
    expect(await hero.versionBadge.isVisible()).toBe(true);

    // テーマ切り替えボタンの表示確認
    const themeButton = await pageHelper.getThemeButton();
    expect(await themeButton.isVisible()).toBe(true);

    // アニメーションの完了を待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  test("テーマ切り替え機能", async ({ page }) => {
    // テーマの初期化を待つ
    await page.waitForFunction(() => {
      const html = document.documentElement;
      return (
        html.classList.contains("light") || html.classList.contains("dark")
      );
    });

    // デフォルトはライトテーマ
    const html = page.locator("html");
    expect(await html.getAttribute("class")).toMatch(/light/);
    expect(await html.getAttribute("class")).not.toMatch(/dark/);

    // テーマ切り替えボタンをクリック
    const themeButton = await pageHelper.getThemeButton();
    await themeButton.click();

    // ダークテーマに切り替わったことを確認
    await page.waitForSelector("html.dark");
    expect(await html.getAttribute("class")).toMatch(/dark/);
  });

  test("フィーチャーとチェンジログの表示", async () => {
    // Featuresセクションの確認
    const features = await pageHelper.getFeaturesSection();
    expect(await features.heading.isVisible()).toBe(true);
    expect(await features.nextjs.isVisible()).toBe(true);
    expect(await features.supabase.isVisible()).toBe(true);
    expect(await features.pwa.isVisible()).toBe(true);

    // Changelogセクションの確認
    const changelog = await pageHelper.getChangelogSection();
    expect(await changelog.heading.isVisible()).toBe(true);
    expect(await changelog.version.isVisible()).toBe(true);
    expect(await changelog.description.isVisible()).toBe(true);
  });

  test("レスポンシブ対応", async () => {
    const layout = await pageHelper.checkResponsiveLayout();

    // モバイルビュー
    expect(await layout.mobile()).toBe(true);

    // タブレットビュー
    expect(await layout.tablet()).toBe(true);

    // デスクトップビュー
    expect(await layout.desktop()).toBe(true);
  });

  test.describe("ビジュアルリグレッションテスト", () => {
    test("フィーチャーカードの表示（ライトモード）", async ({ page }) => {
      // テーマの初期化を待つ
      await page.waitForFunction(() => {
        const html = document.documentElement;
        return html.classList.contains("light");
      });

      // ビューポートサイズを設定
      await page.setViewportSize({ width: 992, height: 800 });

      // フィーチャーカードの表示確認
      const featureCards = page.locator(
        ".grid-cols-1, .md\\:grid-cols-2, .lg\\:grid-cols-3"
      );
      expect(await featureCards.isVisible()).toBe(true);

      // ホバー状態の確認
      const firstCard = page.locator(".grid-cols-1 > div").first();
      await firstCard.hover();
      expect(await firstCard.isVisible()).toBe(true);

      // スクリーンショットの領域を設定
      const cardContainer = page.locator(".grid-cols-1");
      const box = await cardContainer.boundingBox();
      if (!box) throw new Error("カードコンテナが見つかりません");

      // スナップショットの取得（特定の領域のみ）
      await expect(page.locator(".grid-cols-1")).toHaveScreenshot(
        "feature-cards-light.png"
      );
    });

    test("フィーチャーカードの表示（ダークモード）", async ({ page }) => {
      // テーマの初期化を待つ
      await page.waitForFunction(() => {
        const html = document.documentElement;
        return html.classList.contains("light");
      });

      // ビューポートサイズを設定
      await page.setViewportSize({ width: 992, height: 800 });

      // ダークモードに切り替え
      const themeButton = await pageHelper.getThemeButton();
      await themeButton.click();

      // ダークモードの適用を待つ
      await page.waitForSelector("html.dark");
      const html = page.locator("html");
      expect(await html.getAttribute("class")).toMatch(/dark/);

      // フィーチャーカードの表示確認
      const featureCards = page.locator(
        ".grid-cols-1, .md\\:grid-cols-2, .lg\\:grid-cols-3"
      );
      expect(await featureCards.isVisible()).toBe(true);

      // ホバー状態の確認
      const firstCard = page.locator(".grid-cols-1 > div").first();
      await firstCard.hover();
      expect(await firstCard.isVisible()).toBe(true);

      // スクリーンショットの領域を設定
      const cardContainer = page.locator(".grid-cols-1");
      const box = await cardContainer.boundingBox();
      if (!box) throw new Error("カードコンテナが見つかりません");

      // スナップショットの取得（特定の領域のみ）
      await expect(page.locator(".grid-cols-1")).toHaveScreenshot(
        "feature-cards-dark.png"
      );
    });

    test("レスポンシブ表示の確認", async ({ page }) => {
      // テーマの初期化を待つ
      await page.waitForFunction(() => {
        const html = document.documentElement;
        return html.classList.contains("light");
      });

      // モバイル
      await page.setViewportSize({ width: 375, height: 667 });
      expect(await page.locator("main").isVisible()).toBe(true);
      await expect(page.locator("main")).toHaveScreenshot(
        "responsive-mobile.png"
      );

      // タブレット
      await page.setViewportSize({ width: 768, height: 1024 });
      expect(await page.locator("main").isVisible()).toBe(true);
      await expect(page.locator("main")).toHaveScreenshot(
        "responsive-tablet.png"
      );

      // デスクトップ
      await page.setViewportSize({ width: 1280, height: 800 });
      expect(await page.locator("main").isVisible()).toBe(true);
      await expect(page.locator("main")).toHaveScreenshot(
        "responsive-desktop.png"
      );
    });
  });
});
