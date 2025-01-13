import { test, expect, type Page } from '@playwright/test';

// ページオブジェクトモデル
class PWAPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    return this.page.title();
  }

  async getManifestLink() {
    return this.page.locator('link[rel="manifest"]').getAttribute('href');
  }

  async waitForServiceWorker() {
    // Service Workerの登録と活性化を待つ
    return this.page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker is not supported');
        return null;
      }

      try {
        // 既存の登録を確認
        const existing = await navigator.serviceWorker.getRegistration();
        if (existing?.active) {
          return {
            scope: existing.scope,
            active: true,
            state: existing.active.state
          };
        }

        // 新規登録
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Service Workerの活性化を待つ
        if (registration.installing || registration.waiting) {
          await new Promise<void>((resolve) => {
            const worker = registration.installing || registration.waiting;
            if (!worker) {
              resolve();
              return;
            }

            worker.addEventListener('statechange', () => {
              if (worker.state === 'activated') {
                resolve();
              }
            });
          });
        }

        return {
          scope: registration.scope,
          active: true,
          state: registration.active?.state
        };
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    });
  }

  async checkResponsive() {
    await this.page.setViewportSize({ width: 375, height: 667 });
    return this.page.locator('main').isVisible();
  }
}

test.describe('PWA機能テスト', () => {
  let pwaPage: PWAPage;

  test.beforeEach(async ({ page }) => {
    pwaPage = new PWAPage(page);
    await pwaPage.goto();
  });

  test('Webページが正しく表示される', async () => {
    const title = await pwaPage.getTitle();
    expect(title).toContain('Next.js PWA');
  });

  test('PWAマニフェストが存在する', async () => {
    const manifestHref = await pwaPage.getManifestLink();
    expect(manifestHref).toBeTruthy();
    expect(manifestHref).toBe('/manifest.webmanifest');
  });

  test('Service Workerが登録される', async () => {
    test.slow(); // このテストは時間がかかる可能性があることを明示
    
    const registration = await pwaPage.waitForServiceWorker();
    
    expect(registration).toBeTruthy();
    expect(registration?.active).toBe(true);
    expect(registration?.state).toBe('activated');
    expect(registration?.scope).toContain('/');
  });

  test('モバイルで正しく表示される', async () => {
    const isVisible = await pwaPage.checkResponsive();
    expect(isVisible).toBe(true);
  });
});