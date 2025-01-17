import type { Changelog, Feature, TechStack } from "@/types/schema";
import type { DataSource, DataSourceOptions } from "../data-source";
import { changelogsData, featuresData, techStacksData } from "../mock-data";

/**
 * モックデータソースの実装
 */
export class MockDataSource implements DataSource {
  private features: Feature[] = [...featuresData];
  private changelogs: Changelog[] = [...changelogsData];
  private techStacks: TechStack[] = [...techStacksData];

  constructor(private options: DataSourceOptions) {}

  // Features
  async getFeatures(): Promise<Feature[]> {
    return this.features;
  }

  async getFeatureById(id: number): Promise<Feature | null> {
    return this.features.find((feature) => feature.id === id) ?? null;
  }

  async createFeature(
    feature: Omit<Feature, "id" | "created_at">
  ): Promise<Feature> {
    const newFeature: Feature = {
      id: Math.max(...this.features.map((f) => f.id), 0) + 1,
      created_at: new Date().toISOString(),
      ...feature,
    };
    this.features.push(newFeature);
    return newFeature;
  }

  async updateFeature(
    id: number,
    feature: Partial<Omit<Feature, "id" | "created_at">>
  ): Promise<Feature> {
    const index = this.features.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new Error(`Feature with id ${id} not found`);
    }
    this.features[index] = {
      ...this.features[index],
      ...feature,
    };
    return this.features[index];
  }

  async deleteFeature(id: number): Promise<void> {
    const index = this.features.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new Error(`Feature with id ${id} not found`);
    }
    this.features.splice(index, 1);
  }

  // Changelogs
  async getChangelogs(): Promise<Changelog[]> {
    return this.changelogs;
  }

  async getChangelogById(id: number): Promise<Changelog | null> {
    return this.changelogs.find((changelog) => changelog.id === id) ?? null;
  }

  async createChangelog(changelog: Omit<Changelog, "id">): Promise<Changelog> {
    const newChangelog: Changelog = {
      id: Math.max(...this.changelogs.map((c) => c.id), 0) + 1,
      ...changelog,
    };
    this.changelogs.push(newChangelog);
    return newChangelog;
  }

  async updateChangelog(
    id: number,
    changelog: Partial<Omit<Changelog, "id">>
  ): Promise<Changelog> {
    const index = this.changelogs.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Changelog with id ${id} not found`);
    }
    this.changelogs[index] = {
      ...this.changelogs[index],
      ...changelog,
    };
    return this.changelogs[index];
  }

  async deleteChangelog(id: number): Promise<void> {
    const index = this.changelogs.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Changelog with id ${id} not found`);
    }
    this.changelogs.splice(index, 1);
  }

  // TechStacks
  async getTechStacks(): Promise<TechStack[]> {
    return this.techStacks;
  }

  async getTechStackById(id: number): Promise<TechStack | null> {
    return this.techStacks.find((techStack) => techStack.id === id) ?? null;
  }

  async createTechStack(
    techStack: Omit<TechStack, "id" | "created_at">
  ): Promise<TechStack> {
    const newTechStack: TechStack = {
      id: Math.max(...this.techStacks.map((t) => t.id), 0) + 1,
      created_at: new Date().toISOString(),
      ...techStack,
    };
    this.techStacks.push(newTechStack);
    return newTechStack;
  }

  async updateTechStack(
    id: number,
    techStack: Partial<Omit<TechStack, "id" | "created_at">>
  ): Promise<TechStack> {
    const index = this.techStacks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`TechStack with id ${id} not found`);
    }
    this.techStacks[index] = {
      ...this.techStacks[index],
      ...techStack,
    };
    return this.techStacks[index];
  }

  async deleteTechStack(id: number): Promise<void> {
    const index = this.techStacks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`TechStack with id ${id} not found`);
    }
    this.techStacks.splice(index, 1);
  }
}

/**
 * モックデータソースのファクトリー関数
 */
export default async function createMockDataSource(
  options: DataSourceOptions
): Promise<DataSource> {
  return new MockDataSource(options);
}
