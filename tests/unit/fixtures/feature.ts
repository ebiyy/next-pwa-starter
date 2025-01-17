import type { Feature } from "@/types/schema";

export const mockFeature: Feature = {
  id: 1,
  title: "Next.js 15",
  description: "App RouterとReact Server Components",
  icon_name: "code",
  doc_url: "https://nextjs.org/docs",
  created_at: new Date().toISOString(),
};

export const mockFeatures: Feature[] = [
  mockFeature,
  {
    id: 2,
    title: "Supabase",
    description: "認証とデータベース",
    icon_name: "database",
    doc_url: "https://supabase.com/docs",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "PWA対応",
    description: "オフライン対応とモバイルファーストな設計",
    icon_name: "smartphone",
    doc_url: "https://web.dev/progressive-web-apps/",
    created_at: new Date().toISOString(),
  },
];
