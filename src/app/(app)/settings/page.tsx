import { pageMetadata } from "@/lib/metadata";
import { SettingsPageContent } from "@/components/features/settings/settings-sections";

export const metadata = pageMetadata.settings();

export default function SettingsPage() {
  return <SettingsPageContent />;
}
