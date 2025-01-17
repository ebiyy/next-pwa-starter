import {
  createTechStack,
  createTechStackList,
  techStackPresets,
} from "../factories/tech-stack.factory";
import { recordTestTiming, startSuite } from "../helpers/test-reporter";
import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Tech Stacks API", () => {
  startSuite("Tech Stacks API");

  test("GET /api/tech-stacks should return all tech stacks", async () => {
    const expectedStacks = [
      createTechStack({ ...techStackPresets.frontend, id: 1 }),
      createTechStack({ ...techStackPresets.backend, id: 2 }),
    ];

    const { response, data } = await request(`${baseUrl}/tech-stacks`);

    assertResponse.ok(response);
    expect(data).toMatchObject(
      expectedStacks.map((stack) => ({
        ...stack,
        created_at: expect.any(String),
      }))
    );
    recordTestTiming("GET /api/tech-stacks");
  });

  test("GET /api/tech-stacks/:category should return filtered tech stacks", async () => {
    // フロントエンドのみ取得
    const frontendStack = createTechStack({
      ...techStackPresets.frontend,
      id: 1,
    });
    const { response: frontendResponse, data: frontendData } = await request(
      `${baseUrl}/tech-stacks/frontend`
    );

    assertResponse.ok(frontendResponse);
    expect(frontendData).toMatchObject([
      {
        ...frontendStack,
        created_at: expect.any(String),
      },
    ]);

    // バックエンドのみ取得
    const backendStack = createTechStack({
      ...techStackPresets.backend,
      id: 2,
    });
    const { response: backendResponse, data: backendData } = await request(
      `${baseUrl}/tech-stacks/backend`
    );

    assertResponse.ok(backendResponse);
    expect(backendData).toMatchObject([
      {
        ...backendStack,
        created_at: expect.any(String),
      },
    ]);
    recordTestTiming("GET /api/tech-stacks/:category");
  });

  test("Cache should work for tech stacks", async () => {
    // キャッシュなしで実行
    const start = performance.now();
    await request(`${baseUrl}/tech-stacks`, { cache: false });
    const firstDuration = performance.now() - start;

    // キャッシュを作成
    await request(`${baseUrl}/tech-stacks`, { cache: true });

    // キャッシュからの取得を計測
    const cacheStart = performance.now();
    await request(`${baseUrl}/tech-stacks`, { cache: true });
    const cacheDuration = performance.now() - cacheStart;

    // キャッシュされたリクエストの方が高速であることを確認
    expect(cacheDuration).toBeLessThan(firstDuration);
    recordTestTiming("Cache test - all tech stacks");
  });

  test("Cache should work for category-filtered tech stacks", async () => {
    const category = "frontend";

    // キャッシュなしで実行
    const start = performance.now();
    await request(`${baseUrl}/tech-stacks/${category}`, { cache: false });
    const firstDuration = performance.now() - start;

    // キャッシュを作成
    await request(`${baseUrl}/tech-stacks/${category}`, { cache: true });

    // キャッシュからの取得を計測
    const cacheStart = performance.now();
    await request(`${baseUrl}/tech-stacks/${category}`, { cache: true });
    const cacheDuration = performance.now() - cacheStart;

    // キャッシュされたリクエストの方が高速であることを確認
    expect(cacheDuration).toBeLessThan(firstDuration);
    recordTestTiming("Cache test - filtered tech stacks");
  });

  test("should handle tech stack data structure", async () => {
    const { response, data } = await request(`${baseUrl}/tech-stacks`);

    assertResponse.ok(response);
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      category: expect.stringMatching(/^(frontend|backend|testing|tooling)$/),
      description: expect.any(String),
      doc_url: expect.any(String),
      created_at: expect.any(String),
    });
  });
});
