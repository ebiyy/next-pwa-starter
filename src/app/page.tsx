"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code2,
  Cpu,
  Globe2,
  Laptop,
  Moon,
  Sparkles,
  Star,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useRef, useState } from "react";

const MotionBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-grid-white" />
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
    <motion.div
      className="absolute inset-0"
      initial={{ backgroundPosition: "0 0" }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{
        duration: 20,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15), transparent 70%)",
      }}
    />
  </div>
);

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
}

const FloatingElement = ({ children, delay = 0 }: FloatingElementProps) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      delay,
    }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden relative" ref={containerRef}>
      <MotionBackground />

      <div className="container mx-auto px-4 py-20 relative min-h-[200vh]">
        {/* テーマ切り替えボタン */}
        {mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="backdrop-blur-sm bg-background/50"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">テーマを切り替える</span>
            </Button>
          </motion.div>
        )}

        {/* ヒーローセクション */}
        <motion.div
          className="text-center relative z-10"
          style={{ y, opacity }}
        >
          <FloatingElement delay={0.2}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm text-secondary-foreground px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Next.js PWA Starter</span>
            </motion.div>
          </FloatingElement>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300"
          >
            Build Amazing Apps
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            モダンなWeb開発のためのスターターテンプレート。
            PWA対応、最新のスタック、美しいUIを提供します。
          </motion.p>
        </motion.div>

        {/* タブセクション */}
        <Tabs defaultValue="features" className="mt-20">
          <TabsList className="grid w-full max-w-[400px] mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-8">
            {/* フィーチャーカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe2,
                  title: "PWA Ready",
                  description:
                    "オフライン対応とインストール可能なアプリケーション",
                  badge: "Core Feature",
                  details:
                    "Service WorkerとWeb App Manifestを使用したPWA対応により、オフラインでも動作し、ネイティブアプリのような体験を提供します。",
                  gradient: "from-blue-500/20 to-purple-500/20",
                  iconColor: "text-blue-400 dark:text-blue-300",
                },
                {
                  icon: Zap,
                  title: "High Performance",
                  description: "Next.js 15とTurbopackによる高速な開発体験",
                  badge: "Speed",
                  details:
                    "最新のNext.js 15とTurbopackを採用し、高速な開発環境と最適化されたプロダクションビルドを実現します。",
                  gradient: "from-green-500/20 to-teal-500/20",
                  iconColor: "text-green-400 dark:text-green-300",
                },
                {
                  icon: Sparkles,
                  title: "Beautiful UI",
                  description: "モダンでアクセシブルなUIコンポーネント",
                  badge: "Design",
                  details:
                    "shadcn/uiとTailwind CSSを組み合わせることで、美しく、カスタマイズ可能で、アクセシブルなUIを提供します。",
                  gradient: "from-orange-500/20 to-red-500/20",
                  iconColor: "text-orange-400 dark:text-orange-300",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.2 }}
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Card className="group relative overflow-hidden border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out will-change-transform hover:-translate-y-1">
                        <CardHeader className="relative">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                          />
                          <div className="flex items-center justify-between">
                            <FloatingElement delay={i * 0.2}>
                              <feature.icon
                                className={`w-10 h-10 ${feature.iconColor} transition-transform group-hover:scale-110 duration-300`}
                              />
                            </FloatingElement>
                            <Badge
                              variant="secondary"
                              className="relative z-10"
                            >
                              {feature.badge}
                            </Badge>
                          </div>
                          <CardTitle className="relative z-10 mt-4">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="relative z-10">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.details}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Laptop,
                  title: "フロントエンド",
                  items: [
                    {
                      name: "Next.js 15",
                      description: "App RouterとServer Components",
                    },
                    {
                      name: "React 19",
                      description: "最新のReactの機能を活用",
                    },
                    { name: "TypeScript", description: "型安全な開発環境" },
                  ],
                },
                {
                  icon: Code2,
                  title: "開発ツール",
                  items: [
                    { name: "Biome", description: "高速なLinterとFormatter" },
                    {
                      name: "Bun",
                      description: "次世代のJavaScriptランタイム",
                    },
                    { name: "Playwright", description: "モダンなE2Eテスト" },
                  ],
                },
              ].map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <section.icon className="w-5 h-5" />
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.items.map((item, j) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 + j * 0.1 }}
                          className="space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.name}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
