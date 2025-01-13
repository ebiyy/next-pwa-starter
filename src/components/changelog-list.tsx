import type { Changelog } from "@/types/schema";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ChangelogListProps {
  changelogs: Changelog[];
}

export function ChangelogList({ changelogs }: ChangelogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>更新履歴</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {changelogs.map((changelog) => (
          <div
            key={changelog.id}
            className="flex items-start justify-between gap-4 border-b pb-4 last:border-0"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">v{changelog.version}</h3>
                {changelog.is_major && (
                  <Badge variant="default">Major Update</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {changelog.description}
              </p>
            </div>
            <time className="text-sm text-muted-foreground">
              {new Date(changelog.release_date).toLocaleDateString("ja-JP")}
            </time>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
