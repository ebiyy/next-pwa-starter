import {
  changelogPresets,
  createChangelog,
  createChangelogList,
} from "../factories/changelog.factory";
import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Changelogs API", () => {
  test("GET /api/changelogs should return changelogs list", async () => {
    const expectedChangelogs = [
      createChangelog({ ...changelogPresets.majorRelease, id: 1 }),
      createChangelog({ ...changelogPresets.featureUpdate, id: 2 }),
    ];

    const { response, data } = await request(`${baseUrl}/changelogs`);

    assertResponse.ok(response);
    expect(data).toMatchObject(
      expectedChangelogs.map((changelog) => ({
        ...changelog,
        release_date: expect.any(String),
      }))
    );
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

  test("should handle changelog data structure", async () => {
    const { response, data } = await request(`${baseUrl}/changelogs`);

    assertResponse.ok(response);
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
      description: expect.any(String),
      release_date: expect.any(String),
      is_major: expect.any(Boolean),
    });
  });

  test("should handle multiple changelogs with different versions", async () => {
    const { response, data } = await request(`${baseUrl}/changelogs`);

    assertResponse.ok(response);
    const versions = data.map((changelog) => changelog.version);
    const uniqueVersions = new Set(versions);

    // バージョンが重複していないことを確認
    expect(uniqueVersions.size).toBe(versions.length);

    // バージョンが正しい形式であることを確認
    versions.forEach((version) => {
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
});
