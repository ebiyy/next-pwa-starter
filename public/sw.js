const CACHE_NAME = "next-pwa-cache-v1";
const ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// インストール時に必要なアセットをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
      self.skipWaiting(), // 即座にアクティブ化
    ]),
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
    ]),
  );
});

// ネットワークリクエストの制御
self.addEventListener("fetch", (event) => {
  // HTMLリクエストはネットワークファーストで処理
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request).then((response) => {
            return response || caches.match("/").then((response) => {
              return response || new Response("Offline page not found", {
                status: 404,
                statusText: "Not Found",
              });
            });
          });
        })
        .catch(() => {
          return new Response("Network error", {
            status: 500,
            statusText: "Internal Server Error",
          });
        }),
    );
    return;
  }

  // その他のリクエストはキャッシュファーストで処理
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュヒットした場合
      if (response) {
        return response;
      }

      // キャッシュにない場合はネットワークから取得
      return fetch(event.request).then((networkResponse) => {
        // レスポンスが有効な場合のみキャッシュ
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic" ||
          event.request.method !== "GET"
        ) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }),
  );
});

// プッシュ通知の受信（オプション）
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() ?? "新しい更新があります",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
  };

  event.waitUntil(
    self.registration.showNotification("Next.js PWA", options),
  );
});