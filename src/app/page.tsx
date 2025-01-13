import { ChangelogList } from "@/components/changelog-list";
import { FeatureCard } from "@/components/feature-card";
import { TechStackGrid } from "@/components/tech-stack-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { Suspense, use } from "react";

function Features() {
  const features = use(apiClient.getFeatures());
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

function TechStacks() {
  const techStacks = use(apiClient.getTechStacks());
  return <TechStackGrid techStacks={techStacks} />;
}

function Changelogs() {
  const changelogs = use(apiClient.getChangelogs());
  return <ChangelogList changelogs={changelogs} />;
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-6 text-center mb-8">
            <Badge className="animate-fade-up" variant="outline">
              v1.0.0 Now Available
            </Badge>
            <h1 className="animate-fade-up text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Build Amazing Apps
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground animate-fade-up text-base sm:text-xl">
              モダンなWeb開発のためのスターターテンプレート。
            </p>
          </div>

          <div className="space-y-8">
            <Tabs defaultValue="features" className="space-y-6">
              <div className="flex justify-center">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                  <TabsTrigger value="features" className="hover:text-primary">
                    Features
                  </TabsTrigger>
                  <TabsTrigger
                    value="tech-stack"
                    className="hover:text-primary"
                  >
                    Tech Stack
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="features" className="space-y-4">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-24 rounded-lg bg-muted" />
                      <div className="h-24 rounded-lg bg-muted" />
                      <div className="h-24 rounded-lg bg-muted" />
                    </div>
                  }
                >
                  <Features />
                </Suspense>
              </TabsContent>

              <TabsContent value="tech-stack" className="space-y-4">
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-4">
                      <div className="h-24 rounded-lg bg-muted" />
                      <div className="h-24 rounded-lg bg-muted" />
                    </div>
                  }
                >
                  <TechStacks />
                </Suspense>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Changelog</h2>
              <Suspense
                fallback={
                  <div className="animate-pulse space-y-4">
                    <div className="h-24 rounded-lg bg-muted" />
                    <div className="h-24 rounded-lg bg-muted" />
                  </div>
                }
              >
                <Changelogs />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
