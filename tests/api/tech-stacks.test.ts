import type { TechStack } from "@/types/schema";
import { assertResponse, request, setupAPITest } from "./setup";

const { describe, test, expect, context } = setupAPITest();
const { baseUrl } = context;

describe("Tech Stacks API", () => {
  test("GET /api/tech-stacks should return tech stacks list", async () => {
    const { response, data } = await request(`${baseUrl}/tech-stacks`);

    assertResponse.ok(response);
    expect(data).toHaveLength(7);
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      category: expect.any(String),
      doc_url: expect.any(String),
      created_at: expect.any(String),
    });
  });

  test("GET /api/tech-stacks/:category should return filtered tech stacks", async () => {
    const category = "frontend";
    const { response, data } = await request(
      `${baseUrl}/tech-stacks/${category}`
    );
    const techStacks = data as TechStack[];

    assertResponse.ok(response);
    expect(techStacks.length).toBeGreaterThan(0);
    expect(techStacks.every((stack) => stack.category === category)).toBe(true);
  });

  test("should handle error cases", async () => {
    const { response } = await request(
      `${baseUrl}/tech-stacks/invalid-category`
    );
    expect(response.status).toBe(404);
  });
});
