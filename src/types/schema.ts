export interface Feature {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  doc_url: string;
  created_at: string;
}

export interface Changelog {
  id: number;
  version: string;
  description: string;
  release_date: string;
  is_major: boolean;
}

export type TechStackCategory = "frontend" | "backend" | "testing" | "tooling";

export interface TechStack {
  id: number;
  name: string;
  category: TechStackCategory;
  description: string;
  doc_url: string;
  created_at: string;
}
