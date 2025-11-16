import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function GoalsStatsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-background/50"
          >
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex flex-col min-w-0 flex-1 gap-1.5">
              <Skeleton className="h-3 w-16" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-1.5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GoalsFiltersSkeleton() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Controles superiores */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-9 w-full max-w-sm rounded-md" />
              <Skeleton className="h-9 w-[200px] rounded-md" />
              <Skeleton className="h-9 w-[180px] rounded-md" />
            </div>
          </div>

          {/* Grid de metas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="mt-auto border-t">
                  <Skeleton className="h-10 w-full rounded-none rounded-b-xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

