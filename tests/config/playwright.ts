import type { Database } from "@/types/supabase";
import { test as base } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

// カスタムフィクスチャーの型定義
type TestFixtures = {
  supabase: ReturnType<typeof createClient<Database>>;
};

// 環境変数の検証
const validateEnv = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }
  if (!supabaseKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }

  return { supabaseUrl, supabaseKey };
};

// Playwrightのテスト設定を拡張
export const test = base.extend<TestFixtures>({
  // Supabaseクライアントのフィクスチャー
  supabase: [
    async (_ctx, use) => {
      const { supabaseUrl, supabaseKey } = validateEnv();
      const supabase = createClient<Database>(supabaseUrl, supabaseKey);

      await use(supabase);

      // テスト後のクリーンアップ
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
      }
    },
    { scope: "test" },
  ],
});

export { expect } from "@playwright/test";
