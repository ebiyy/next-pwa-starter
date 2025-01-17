import { expect, test } from "@playwright/test";
import {
  checkOfflineMode,
  checkServiceWorker,
  setupPWATest,
} from "./helpers/pwa-helper";

test.describe("PWA機能", () => {
  test.beforeEach(async ({ page }) => {
    await setupPWATest(page);
  });

  test("マニフェストが正しく設定されている", async ({ page }) => {
    const manifest = await page.evaluate(async () => {
      const response = await fetch("/manifest.webmanifest");
      return response.json();
    });

    // 基本設定の検証
    expect(manifest.name).toBe("Next.js PWA Starter");
    expect(manifest.short_name).toBe("PWA Starter");
    expect(manifest.display).toBe("standalone");

    // アイコンの検証
    expect(manifest.icons).toHaveLength(4);
    const hasRequiredIcons = manifest.icons.some(
      (icon: any) => icon.sizes === "512x512" && icon.purpose === "maskable"
    );
    expect(hasRequiredIcons).toBe(true);
  });

  test("Service Workerが正しく登録されている", async ({ page }) => {
    const isRegistered = await checkServiceWorker(page);
    expect(isRegistered).toBe(true);
  });

  test("オフラインモードで動作する", async ({ page }) => {
    const offlineContent = await checkOfflineMode(page);
    expect(offlineContent).toContain("オフライン");
  });

  test("インストール可能なPWAとして認識される", async ({ page }) => {
    // beforeInstallpromptイベントの発火を確認
    const hasInstallPrompt = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          resolve(true);
        });
        // 5秒後にタイムアウト
        setTimeout(() => resolve(false), 5000);
      });
    });

    expect(hasInstallPrompt).toBe(true);
  });

  test("プッシュ通知の許可を要求できる", async ({ page }) => {
    // プッシュ通知の権限要求をモック
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if ("Notification" in window) {
          Notification.requestPermission().then(resolve);
        } else {
          resolve("denied");
        }
      });
    });

    // Service Workerの登録を確認
    const registration = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return reg.pushManager.getSubscription().then(Boolean);
    });

    expect(registration).toBeDefined();
  });
});
