import {
  createFeature,
  createFeatureList,
  featurePresets,
} from "../factories/feature.factory";
import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Features API", () => {
  test("GET /api/features should return features list", async () => {
    const expectedFeatures = [
      createFeature({ ...featurePresets.pwa, id: 1 }),
      createFeature({ ...featurePresets.serverComponents, id: 2 }),
      createFeature({ id: 3 }),
    ];

    const { response, data } = await request(`${baseUrl}/features`);

    assertResponse.ok(response);
    expect(data).toMatchObject(
      expectedFeatures.map((feature) => ({
        ...feature,
        created_at: expect.any(String),
      }))
    );
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

  test("should handle feature data structure", async () => {
    const { response, data } = await request(`${baseUrl}/features`);

    assertResponse.ok(response);
    expect(data).toHaveLength(5);
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      icon_name: expect.any(String),
      doc_url: expect.any(String),
      created_at: expect.any(String),
    });
  });
});
