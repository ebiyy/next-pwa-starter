import type { Page } from "@playwright/test";

interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

/**
 * PWAテストのセットアップ
 */
export async function setupPWATest(page: Page): Promise<void> {
  // オフラインモードをサポートするためにService Workerを有効化
  await page.goto("/", {
    waitUntil: "networkidle",
  });

  // Service Workerの登録を待機
  await page.waitForFunction(() => {
    return navigator.serviceWorker.ready.then(() => true);
  });
}

/**
 * Service Workerの登録状態を確認
 */
export async function checkServiceWorker(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration !== undefined;
  });
}

/**
 * オフラインモードでの動作を確認
 */
export async function checkOfflineMode(page: Page): Promise<string> {
  // オフラインモードを有効化
  await page.context().setOffline(true);

  // ページをリロード
  await page.reload();

  // オフラインページのコンテンツを取得
  const content = await page.textContent("main");

  // オフラインモードを無効化
  await page.context().setOffline(false);

  return content || "";
}

/**
 * マニフェストの内容を検証
 */
export async function validateManifest(page: Page): Promise<{
  hasRequiredIcons: boolean;
  hasRequiredProperties: boolean;
}> {
  const manifest = await page.evaluate(async () => {
    const response = await fetch("/manifest.webmanifest");
    return response.json();
  });

  // 必須アイコンの存在確認
  const hasRequiredIcons = (manifest.icons as PWAIcon[]).some(
    (icon) => icon.sizes === "512x512" && icon.purpose === "maskable"
  );

  // 必須プロパティの存在確認
  const hasRequiredProperties =
    typeof manifest.name === "string" &&
    typeof manifest.short_name === "string" &&
    typeof manifest.display === "string" &&
    Array.isArray(manifest.icons);

  return { hasRequiredIcons, hasRequiredProperties };
}

/**
 * インストール可能状態を確認
 */
export async function checkInstallability(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return new Promise<boolean>((resolve) => {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        resolve(true);
      });
      // 5秒後にタイムアウト
      setTimeout(() => resolve(false), 5000);
    });
  });
}
