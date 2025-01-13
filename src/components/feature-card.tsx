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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
