import { AttentionSection } from "@/components/mission-control/attention-section";
import { CommunicationsPreview } from "@/components/mission-control/communications-preview";
import { OperationsPreview } from "@/components/mission-control/operations-preview";
import { QuickSearchBanner } from "@/components/mission-control/quick-search-banner";
import { Welcome } from "@/components/mission-control/welcome";

export default function MissionControlPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <Welcome />
      <QuickSearchBanner />
      <AttentionSection />
      <OperationsPreview />
      <CommunicationsPreview />
    </div>
  );
}
