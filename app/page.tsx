import { Suspense } from "react";
import { NewsFeed } from "@/components/news-feed";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Latest AI &amp; Tech News</h1>
        <p className="text-muted-foreground text-sm">รวบรวมและสรุปข่าวล่าสุดด้วย Claude Sonnet</p>
      </div>
      <Suspense fallback={<NewsFeedSkeleton />}>
        <NewsFeed />
      </Suspense>
    </div>
  );
}

function NewsFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
