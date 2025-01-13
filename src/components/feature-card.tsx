import type { Feature } from "@/types/schema";
import {
  Code,
  Database,
  type LucideIcon,
  Palette,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
    <Card className="group relative h-full overflow-hidden border bg-background/50 transition-colors hover:border-primary/50">
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
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </CardContent>
      </div>
    </Card>
  );
}
