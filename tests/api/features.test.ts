import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

// モックデータ
const mockFeatures = [
  {
    id: 1,
    title: "Next.js 15",
    description:
      "App RouterとServer Componentsによる最新のReactアプリケーション開発",
    icon: "🚀",
    created_at: expect.any(String),
  },
  {
    id: 2,
    title: "Supabase",
    description: "オープンソースのFirebase代替。認証やデータベースを簡単に実装",
    icon: "🗄️",
    created_at: expect.any(String),
  },
  {
    id: 3,
    title: "PWA対応",
    description: "Progressive Web Appとしてインストール可能",
    icon: "📱",
    created_at: expect.any(String),
  },
];

describe("Features API", () => {
  test("GET /api/features should return features list", async () => {
    const { response, data } = await request(`${baseUrl}/features`);

    assertResponse.ok(response);
    expect(data).toEqual(mockFeatures);
  });

  test("Cache should work for features", async () => {
    // キャッシュなしで実行
    const start = performance.now();
    await request(`${baseUrl}/features`, { cache: false });
    const firstDuration = performance.now() - start;

    // キャッシュを作成
    await request(`${baseUrl}/features`, { cache: true });

    // キャッシュからの取得を計測
    const cacheStart = performance.now();
    await request(`${baseUrl}/features`, { cache: true });
    const cacheDuration = performance.now() - cacheStart;

    // キャッシュされたリクエストの方が高速であることを確認
    expect(cacheDuration).toBeLessThan(firstDuration);
  });
});
