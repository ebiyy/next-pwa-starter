const CACHE_NAME = "next-pwa-cache-v1";
const OFFLINE_PAGE = "/offline";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1週間

const PRECACHE_ASSETS = [
  "/",
  OFFLINE_PAGE,
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
  // スタイルシートとスクリプト
  ...self.__WB_MANIFEST || [],
];

// キャッシュの有効期限をチェック
const isExpired = (cachedResponse) => {
  if (!cachedResponse) return true;
  const dateHeader = cachedResponse.headers.get("date");
  if (!dateHeader) return true;
  const cachedTime = new Date(dateHeader).getTime();
  return Date.now() - cachedTime > CACHE_DURATION;
};

// オフラインページを返す
const getOfflinePage = async () => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(OFFLINE_PAGE);
  if (cachedResponse) return cachedResponse;
  return new Response(
    "オフラインです。ネットワーク接続を確認してください。",
    {
      status: 503,
      statusText: "Service Unavailable",
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
      },
    }
  );
};

// インストール時に必要なアセットをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
      self.skipWaiting(),
    ]).catch((error) => {
      console.error("Service Worker installation failed:", error);
    }),
  );
});

// 新しいService Workerがアクティブになったときの処理
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // 古いキャッシュを削除
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        );
      }),
      // 即座にページをコントロール
      self.clients.claim(),
    ]).catch((error) => {
      console.error("Service Worker activation failed:", error);
    }),
  );
});

// ネットワークリクエストの制御
self.addEventListener("fetch", (event) => {
  // APIリクエストはネットワークオンリー
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Network error" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // HTMLリクエストはネットワークファーストで処理
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || getOfflinePage();
        }),
    );
    return;
  }

  // 画像、スタイル、スクリプトはキャッシュファーストで処理
  if (event.request.destination === "image" ||
      event.request.destination === "style" ||
      event.request.destination === "script") {
    event.respondWith(
      caches.match(event.request).then(async (cachedResponse) => {
        // キャッシュが有効な場合はそれを使用
        if (cachedResponse && !isExpired(cachedResponse)) {
          return cachedResponse;
        }

        try {
          // ネットワークから取得
          const networkResponse = await fetch(event.request);
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseToCache);
          return networkResponse;
        } catch (error) {
          // ネットワークエラー時は期限切れでも古いキャッシュを使用
          return cachedResponse || new Response("Resource not available", {
            status: 404,
            statusText: "Not Found",
          });
        }
      }),
    );
    return;
  }

  // その他のリクエストはネットワークファーストで処理
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (!networkResponse.ok) {
          throw new Error(`HTTP error! status: ${networkResponse.status}`);
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.method === "GET") {
            cache.put(event.request, responseToCache);
          }
        });
        return networkResponse;
      })
      .catch(async (error) => {
        console.error("Fetch failed:", error);
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || new Response("Network error", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }),
  );
});

// プッシュ通知の受信
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() ?? "新しい更新があります",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
    actions: [
      {
        action: "explore",
        title: "確認する",
        icon: "/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Next.js PWA", options)
      .catch((error) => {
        console.error("Push notification failed:", error);
      }),
  );
});

// 通知クリック時の処理
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(
      clients.openWindow("/")
        .catch((error) => {
          console.error("Failed to open window:", error);
        }),
    );
  }
});