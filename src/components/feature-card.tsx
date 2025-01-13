import type { Feature } from "@/types/schema";
import {
  Code,
  Database,
  type LucideIcon,
  Palette,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface FeatureCardProps {
  feature: Feature;
}

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  code: Code,
  database: Database,
  palette: Palette,
};

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon_name] || Smartphone;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="group relative h-full overflow-hidden border bg-background/50 transition-colors hover:border-primary/50 cursor-pointer">
          <div className="pointer-events-none absolute inset-0 z-0 transition-colors group-hover:bg-primary/[0.02]" />
          <div className="absolute inset-px z-10 bg-background/80 backdrop-blur-xl" />
          <div className="relative z-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </div>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-[320px] backdrop-blur-xl">
        <div className="space-y-2">
          <h4 className="font-semibold tracking-tight">{feature.title}</h4>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
          <div className="pt-2">
            <a
              href={feature.doc_url}
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
  );
}
