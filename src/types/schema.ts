export interface Feature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  doc_url: string;
  created_at: string;
}

export interface Changelog {
  id: string;
  version: string;
  description: string;
  release_date: string;
  is_major: boolean;
}

export interface TechStack {
  id: string;
  name: string;
  category: string;
  description: string;
  doc_url: string;
  created_at: string;
}

export type TechStackCategory = "frontend" | "backend" | "testing" | "tooling";
