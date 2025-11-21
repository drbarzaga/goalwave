import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { ActivityPageContent } from "@/components/features/activity/activity-sections";
import { ActivitySkeleton } from "@/components/features/activity/activity-skeletons";

export const metadata = pageMetadata.activity();

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <ActivityPageContent />
    </Suspense>
  );
}
