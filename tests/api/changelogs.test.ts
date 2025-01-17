import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Changelogs API", () => {
  test("GET /api/changelogs should return changelogs list", async () => {
    const { response, data } = await request(`${baseUrl}/changelogs`);

    assertResponse.ok(response);
    expect(data).toHaveLength(5);
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      version: expect.any(String),
      description: expect.any(String),
      release_date: expect.any(String),
      is_major: expect.any(Boolean),
    });
  });

  test("should handle error cases", async () => {
    const { response } = await request(`${baseUrl}/changelogs/invalid`);
    expect(response.status).toBe(404);
  });
});
