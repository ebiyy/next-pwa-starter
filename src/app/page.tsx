import { ChangelogList } from "@/components/changelog-list";
import { FeatureCard } from "@/components/feature-card";
import { TechStackGrid } from "@/components/tech-stack-grid";
import type { Changelog, Feature, TechStack } from "@/types/schema";
import { Suspense } from "react";

async function getFeatures(): Promise<Feature[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api`
    : "http://localhost:3000/api";

  const res = await fetch(`${baseUrl}/features`, { cache: "no-store" });
  return res.json();
}

async function getChangelogs(): Promise<Changelog[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api`
    : "http://localhost:3000/api";

  const res = await fetch(`${baseUrl}/changelogs`, { cache: "no-store" });
  return res.json();
}

async function getTechStacks(): Promise<TechStack[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api`
    : "http://localhost:3000/api";

  const res = await fetch(`${baseUrl}/tech-stacks`, { cache: "no-store" });
  return res.json();
}

function Features({ promise }: { promise: Promise<Feature[]> }) {
  return (
    <Suspense fallback={<div>Loading features...</div>}>
      <FeaturesContent promise={promise} />
    </Suspense>
  );
}

async function FeaturesContent({ promise }: { promise: Promise<Feature[]> }) {
  const features = await promise;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

function TechStacks({ promise }: { promise: Promise<TechStack[]> }) {
  return (
    <Suspense fallback={<div>Loading tech stacks...</div>}>
      <TechStacksContent promise={promise} />
    </Suspense>
  );
}

async function TechStacksContent({
  promise,
}: { promise: Promise<TechStack[]> }) {
  const techStacks = await promise;
  return <TechStackGrid techStacks={techStacks} />;
}

function Changelogs({ promise }: { promise: Promise<Changelog[]> }) {
  return (
    <Suspense fallback={<div>Loading changelogs...</div>}>
      <ChangelogsContent promise={promise} />
    </Suspense>
  );
}

async function ChangelogsContent({
  promise,
}: { promise: Promise<Changelog[]> }) {
  const changelogs = await promise;
  return <ChangelogList changelogs={changelogs} />;
}

export default function Home() {
  const featuresPromise = getFeatures();
  const changelogsPromise = getChangelogs();
  const techStacksPromise = getTechStacks();

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center">Next.js PWA Starter</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">機能</h2>
        <Features promise={featuresPromise} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">技術スタック</h2>
        <TechStacks promise={techStacksPromise} />
      </section>

      <section className="space-y-4">
        <Changelogs promise={changelogsPromise} />
      </section>
    </main>
  );
}
