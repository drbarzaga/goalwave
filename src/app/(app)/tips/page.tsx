import { pageMetadata } from "@/lib/metadata";
import { TipsPageContent } from "@/components/features/tips/tips-sections";

export const metadata = pageMetadata.tips();

export default function TipsPage() {
  return <TipsPageContent />;
}
