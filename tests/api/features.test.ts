import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Features API", () => {
  test("GET /api/features should return features list", async () => {
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

  test("should handle error cases", async () => {
    const { response } = await request(`${baseUrl}/features/invalid`);
    expect(response.status).toBe(404);
  });
});
