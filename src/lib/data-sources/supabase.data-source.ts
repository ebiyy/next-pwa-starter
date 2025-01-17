import type { Changelog, Feature, TechStack } from "@/types/schema";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import type { DataSource, DataSourceOptions } from "../data-source";

/**
 * Supabaseデータソースの実装
 */
export class SupabaseDataSource implements DataSource {
  private client: SupabaseClient;

  constructor(private options: DataSourceOptions) {
    if (!options.databaseUrl) {
      throw new Error("Database URL is required for Supabase data source");
    }
    if (!options.supabaseAnonKey) {
      throw new Error("Supabase anon key is required");
    }

    this.client = createClient(options.databaseUrl, options.supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  // Features
  async getFeatures(): Promise<Feature[]> {
    const { data, error } = await this.client
      .from("features")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get features: ${error.message}`);
    return data;
  }

  async getFeatureById(id: number): Promise<Feature | null> {
    const { data, error } = await this.client
      .from("features")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get feature: ${error.message}`);
    }
    return data;
  }

  async createFeature(
    feature: Omit<Feature, "id" | "created_at">
  ): Promise<Feature> {
    const { data, error } = await this.client
      .from("features")
      .insert([feature])
      .select()
      .single();

    if (error) throw new Error(`Failed to create feature: ${error.message}`);
    return data;
  }

  async updateFeature(
    id: number,
    feature: Partial<Omit<Feature, "id" | "created_at">>
  ): Promise<Feature> {
    const { data, error } = await this.client
      .from("features")
      .update(feature)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update feature: ${error.message}`);
    return data;
  }

  async deleteFeature(id: number): Promise<void> {
    const { error } = await this.client.from("features").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete feature: ${error.message}`);
  }

  // Changelogs
  async getChangelogs(): Promise<Changelog[]> {
    const { data, error } = await this.client
      .from("changelogs")
      .select("*")
      .order("release_date", { ascending: false });

    if (error) throw new Error(`Failed to get changelogs: ${error.message}`);
    return data;
  }

  async getChangelogById(id: number): Promise<Changelog | null> {
    const { data, error } = await this.client
      .from("changelogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get changelog: ${error.message}`);
    }
    return data;
  }

  async createChangelog(changelog: Omit<Changelog, "id">): Promise<Changelog> {
    const { data, error } = await this.client
      .from("changelogs")
      .insert([changelog])
      .select()
      .single();

    if (error) throw new Error(`Failed to create changelog: ${error.message}`);
    return data;
  }

  async updateChangelog(
    id: number,
    changelog: Partial<Omit<Changelog, "id">>
  ): Promise<Changelog> {
    const { data, error } = await this.client
      .from("changelogs")
      .update(changelog)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update changelog: ${error.message}`);
    return data;
  }

  async deleteChangelog(id: number): Promise<void> {
    const { error } = await this.client
      .from("changelogs")
      .delete()
      .eq("id", id);
    if (error) throw new Error(`Failed to delete changelog: ${error.message}`);
  }

  // TechStacks
  async getTechStacks(): Promise<TechStack[]> {
    const { data, error } = await this.client
      .from("tech_stacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get tech stacks: ${error.message}`);
    return data;
  }

  async getTechStackById(id: number): Promise<TechStack | null> {
    const { data, error } = await this.client
      .from("tech_stacks")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get tech stack: ${error.message}`);
    }
    return data;
  }

  async createTechStack(
    techStack: Omit<TechStack, "id" | "created_at">
  ): Promise<TechStack> {
    const { data, error } = await this.client
      .from("tech_stacks")
      .insert([techStack])
      .select()
      .single();

    if (error) throw new Error(`Failed to create tech stack: ${error.message}`);
    return data;
  }

  async updateTechStack(
    id: number,
    techStack: Partial<Omit<TechStack, "id" | "created_at">>
  ): Promise<TechStack> {
    const { data, error } = await this.client
      .from("tech_stacks")
      .update(techStack)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update tech stack: ${error.message}`);
    return data;
  }

  async deleteTechStack(id: number): Promise<void> {
    const { error } = await this.client
      .from("tech_stacks")
      .delete()
      .eq("id", id);
    if (error) throw new Error(`Failed to delete tech stack: ${error.message}`);
  }
}

/**
 * Supabaseデータソースのファクトリー関数
 */
export default async function createSupabaseDataSource(
  options: DataSourceOptions
): Promise<DataSource> {
  return new SupabaseDataSource(options);
}
