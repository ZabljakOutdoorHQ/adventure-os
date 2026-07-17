import { Inbox, MessagesSquare } from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function CommunicationsPage() {
  return (
    <PagePlaceholder
      description="Email, chat and messages connected to the people, projects and work they relate to — read-only, never sent without approval."
      eyebrow="Communications"
      regions={[
        {
          title: "Inbox",
          description:
            "Gmail and Mattermost messages linked to the people, organisations and bookings they relate to.",
          icon: Inbox,
        },
        {
          title: "Threads",
          description:
            "Conversations grouped by subject and entity, not scattered across separate inboxes.",
          icon: MessagesSquare,
        },
      ]}
      title="Communications"
    />
  );
}
