import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { ReportsPageContent } from "@/components/features/reports/reports-sections";
import { ReportsSkeleton } from "@/components/features/reports/reports-skeletons";

export const metadata = pageMetadata.reports();

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsPageContent />
    </Suspense>
  );
}
