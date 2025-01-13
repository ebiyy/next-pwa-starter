import type { Changelog } from "@/types/schema";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ChangelogListProps {
  changelogs: Changelog[];
}

export function ChangelogList({ changelogs }: ChangelogListProps) {
  return (
    <Card className="relative overflow-hidden border bg-background/50">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-px z-10 bg-background/80 backdrop-blur-xl" />
      <div className="relative z-20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            更新履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[136px] overflow-y-auto pr-4">
            <div className="space-y-6">
              {changelogs.map((changelog, index) => (
                <div
                  key={changelog.id}
                  className="group relative flex items-start gap-6"
                >
                  {index !== changelogs.length - 1 && (
                    <div className="absolute left-[11px] top-[22px] h-full w-px bg-border group-hover:bg-primary/50" />
                  )}

                  <div className="relative mt-1 h-6 w-6 rounded-full border bg-background shadow-sm group-hover:border-primary/50">
                    <div className="absolute inset-[3px] rounded-full bg-muted group-hover:bg-primary/20" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        v{changelog.version}
                      </h3>
                      {changelog.is_major && (
                        <Badge
                          variant="default"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Major Update
                        </Badge>
                      )}
                      <time className="text-sm text-muted-foreground">
                        {new Date(changelog.release_date).toLocaleDateString(
                          "ja-JP"
                        )}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {changelog.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
