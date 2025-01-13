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
      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="hover:text-primary data-[state=active]:bg-background"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent
          key={category.value}
          value={category.value}
          className="mt-6 space-y-4"
        >
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
                      className="group relative block overflow-hidden rounded-lg border bg-background/50 p-6 transition-colors hover:border-primary/50"
                    >
                      <div className="pointer-events-none absolute inset-0 z-0 transition-colors group-hover:bg-primary/[0.02]" />
                      <div className="absolute inset-px z-10 bg-background/80 backdrop-blur-xl" />
                      <div className="relative z-20">
                        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                          {stack.name}
                        </h3>
                      </div>
                    </a>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="start"
                    className="w-[320px] backdrop-blur-xl"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold tracking-tight">
                        {stack.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {stack.description}
                      </p>
                      <div className="pt-2">
                        <a
                          href={stack.doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          ドキュメントを見る
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            role="presentation"
                          >
                            <title>右矢印</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </a>
                      </div>
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
