import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

// モックデータ
const mockChangelogs = [
  {
    id: 1,
    version: "1.0.0",
    description: "初期リリース",
    release_date: expect.any(String),
  },
  {
    id: 2,
    version: "1.1.0",
    description: "PWA対応を追加",
    release_date: expect.any(String),
  },
];

describe("Changelogs API", () => {
  test("GET /api/changelogs should return changelogs list", async () => {
    const { response, data } = await request(`${baseUrl}/changelogs`);

    assertResponse.ok(response);
    expect(data).toEqual(mockChangelogs);
  });

  test("Cache should work for changelogs", async () => {
    // キャッシュなしで実行
    const start = performance.now();
    await request(`${baseUrl}/changelogs`, { cache: false });
    const firstDuration = performance.now() - start;

    // キャッシュを作成
    await request(`${baseUrl}/changelogs`, { cache: true });

    // キャッシュからの取得を計測
    const cacheStart = performance.now();
    await request(`${baseUrl}/changelogs`, { cache: true });
    const cacheDuration = performance.now() - cacheStart;

    // キャッシュされたリクエストの方が高速であることを確認
    expect(cacheDuration).toBeLessThan(firstDuration);
  });
});
