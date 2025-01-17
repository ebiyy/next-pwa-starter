import { changelogsData as changelogs } from "./changelogs";
import { featuresData as features } from "./features";
import { techStacksData as techStacks } from "./tech-stacks";

export const techStacksData = techStacks;
export const featuresData = features;
export const changelogsData = changelogs;

// データの型を再エクスポート
export type { TechStack, Feature, Changelog } from "@/types/schema";
