"use client";

import type { TechStack, TechStackCategory } from "@/types/schema";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TechStackGridProps {
  techStacks: TechStack[];
}

const categories: { value: TechStackCategory; label: string }[] = [
  { value: "frontend", label: "フロントエンド" },
  { value: "backend", label: "バックエンド" },
  { value: "testing", label: "テスト" },
  { value: "tooling", label: "ツール" },
];

export function TechStackGrid({ techStacks }: TechStackGridProps) {
  return (
    <Tabs defaultValue="frontend" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {categories.map((category) => (
          <TabsTrigger key={category.value} value={category.value}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category.value} value={category.value}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStacks
              .filter((stack) => stack.category === category.value)
              .map((stack) => (
                <HoverCard key={stack.id}>
                  <HoverCardTrigger asChild>
                    <a
                      href={stack.doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold">{stack.name}</h3>
                    </a>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{stack.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stack.description}
                      </p>
                      <p className="text-sm">
                        <a
                          href={stack.doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          ドキュメントを見る →
                        </a>
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
