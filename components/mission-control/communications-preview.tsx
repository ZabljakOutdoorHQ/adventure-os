import { FileEdit, Inbox, MessagesSquare } from "lucide-react";
import { PreviewRow } from "./preview-row";

const communicationsItems = [
  {
    title: "Emails",
    icon: Inbox,
    emptyState:
      "Email linked to people and projects will appear here once Gmail is connected — read-only, never sent without approval.",
  },
  {
    title: "Messages",
    icon: MessagesSquare,
    emptyState:
      "Team chat relevant to your work will appear here once Mattermost is connected.",
  },
  {
    title: "Draft replies",
    icon: FileEdit,
    emptyState:
      "The assistant can prepare draft replies for review here — nothing is ever sent without your approval.",
  },
];

export function CommunicationsPreview() {
  return (
    <section aria-labelledby="communications-heading">
      <h2 className="mb-3 text-base font-semibold" id="communications-heading">
        Communications
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {communicationsItems.map((item) => (
          <PreviewRow key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
