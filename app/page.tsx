import { Suspense } from "react";
import { NewsFeed } from "@/components/news-feed";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      <div className="mb-10 pb-8 border-b border-border/40">
        <p className="text-xs font-black tracking-widest uppercase text-sky-400 mb-3">
          AI &amp; Tech Briefing
        </p>
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-2">
          Latest from the frontier
        </h1>
        <p className="text-sm text-muted-foreground">
          รวบรวมและสรุปข่าว AI/Tech ล่าสุดจากทุกแหล่ง อัปเดตทุกวัน
        </p>
      </div>

      <Suspense fallback={<NewsFeedSkeleton />}>
        <NewsFeed />
      </Suspense>
    </div>
  );
}

function NewsFeedSkeleton() {
  return (
    <div>
      <div className="flex gap-6 border-b border-border/40 pb-8 mb-8">
        <Skeleton className="w-48 h-28 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-2.5 w-28" />
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-border/40 py-4">
          <Skeleton className="w-14 h-14 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
