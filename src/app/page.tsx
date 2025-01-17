import { ChangelogList } from "@/components/changelog-list";
import { FeatureCard } from "@/components/feature-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { initializeDataSource } from "@/lib/data-source";
import { Suspense, use } from "react";

// DataSourceの初期化
const initializeAPI = async () => {
  await initializeDataSource({
    provider: "supabase",
    environment:
      (process.env.NODE_ENV as "development" | "staging" | "production") ??
      "development",
    databaseUrl: process.env.SUPABASE_URL ?? "http://127.0.0.1:54321",
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ??
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  });
};

function Features() {
  const features = use(apiClient.getFeatures());
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

function Changelogs() {
  const changelogs = use(apiClient.getChangelogs());
  return <ChangelogList changelogs={changelogs} />;
}

export default async function Home() {
  // DataSourceの初期化
  await initializeAPI();

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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Features</h2>
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
            </div>

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
