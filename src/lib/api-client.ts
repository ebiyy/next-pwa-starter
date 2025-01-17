import type { Changelog, Feature, TechStack } from "@/types/schema";
import { getDataSource } from "./data-source";

export interface ApiClient {
  getFeatures(): Promise<Feature[]>;
  getChangelogs(): Promise<Changelog[]>;
  getTechStacks(): Promise<TechStack[]>;
  getTechStacksByCategory(category: string): Promise<TechStack[]>;
}

class DataSourceApiClient implements ApiClient {
  async getFeatures(): Promise<Feature[]> {
    const dataSource = getDataSource();
    return dataSource.getFeatures();
  }

  async getChangelogs(): Promise<Changelog[]> {
    const dataSource = getDataSource();
    return dataSource.getChangelogs();
  }

  async getTechStacks(): Promise<TechStack[]> {
    const dataSource = getDataSource();
    return dataSource.getTechStacks();
  }

  async getTechStacksByCategory(category: string): Promise<TechStack[]> {
    const dataSource = getDataSource();
    const techStacks = await dataSource.getTechStacks();
    return techStacks.filter((stack) => stack.category === category);
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

// 環境に応じてクライアントを選択
const getApiClient = (): ApiClient => {
  const isServer = typeof window === "undefined";
  return isServer ? new DataSourceApiClient() : new HonoApiClient();
};

export const apiClient: ApiClient = getApiClient();
