import { Inbox, MessagesSquare } from "lucide-react";
import { EntitySectionCard } from "@/components/demo/entity-section-card";
import { SectionHeader } from "@/components/demo/section-header";
import { factValue, messages } from "@/lib/demo/data";

export default function CommunicationsPage() {
  const inbox = messages.filter(
    (message) => factValue(message, "Channel") === "Gmail",
  );
  const threads = messages.filter(
    (message) => factValue(message, "Channel") === "Mattermost",
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Email and chat connected to the people, projects and work they relate to — read-only, never sent without approval. Demo data only."
        eyebrow="Communications"
        title="Communications"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <EntitySectionCard icon={Inbox} items={inbox} title="Inbox" />
        <EntitySectionCard
          icon={MessagesSquare}
          items={threads}
          title="Threads"
        />
      </div>
    </div>
  );
}
