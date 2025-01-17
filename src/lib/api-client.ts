import type { Changelog, Feature, TechStack } from "@/types/schema";
import { mockChangelogs, mockFeatures, mockTechStacks } from "./mock-data";

export interface ApiClient {
  getFeatures(): Promise<Feature[]>;
  getChangelogs(): Promise<Changelog[]>;
  getTechStacks(): Promise<TechStack[]>;
  getTechStacksByCategory(category: string): Promise<TechStack[]>;
}

class MockApiClient implements ApiClient {
  async getFeatures(): Promise<Feature[]> {
    return mockFeatures;
  }

  async getChangelogs(): Promise<Changelog[]> {
    return mockChangelogs;
  }

  async getTechStacks(): Promise<TechStack[]> {
    return mockTechStacks;
  }

  async getTechStacksByCategory(category: string): Promise<TechStack[]> {
    return mockTechStacks.filter((stack) => stack.category === category);
  }
}

class HonoApiClient implements ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api`
      : "http://localhost:3100/api";
  }

  async getFeatures(): Promise<Feature[]> {
    const response = await fetch(`${this.baseUrl}/features`);
    return response.json();
  }

  async getChangelogs(): Promise<Changelog[]> {
    const response = await fetch(`${this.baseUrl}/changelogs`);
    return response.json();
  }

  async getTechStacks(): Promise<TechStack[]> {
    const response = await fetch(`${this.baseUrl}/tech-stacks`);
    return response.json();
  }

  async getTechStacksByCategory(category: string): Promise<TechStack[]> {
    const response = await fetch(`${this.baseUrl}/tech-stacks/${category}`);
    return response.json();
  }
}

// 開発中はモッククライアントを使用
export const apiClient: ApiClient = new MockApiClient();

// 本番環境では実際のAPIクライアントを使用
// export const apiClient: ApiClient = new HonoApiClient();
