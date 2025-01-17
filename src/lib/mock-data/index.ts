import { changelogsData as changelogs } from "./changelogs";
import { featuresData as features } from "./features";
import { techStacksData as techStacks } from "./tech-stacks";

export const mockTechStacks = techStacks;
export const mockFeatures = features;
export const mockChangelogs = changelogs;

// データの型を再エクスポート
export type { TechStack, Feature, Changelog } from "@/types/schema";
