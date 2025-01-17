import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>オフライン</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            インターネット接続が切断されています。
            ネットワーク接続を確認してください。
          </p>
          <Button asChild className="w-full">
            <Link href="/">ホームに戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
