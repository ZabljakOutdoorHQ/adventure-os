import { HelpCircle, Sparkles, UserCheck, Users } from "lucide-react";
import { AttentionCard } from "./attention-card";

const attentionCards = [
  {
    title: "Waiting for me",
    icon: UserCheck,
    emptyState: "Nothing is waiting on you right now.",
  },
  {
    title: "Waiting for team",
    icon: Users,
    emptyState: "Nothing is waiting on the team right now.",
  },
  {
    title: "AI prepared",
    icon: Sparkles,
    emptyState: "The assistant hasn't prepared anything for review yet.",
  },
  {
    title: "Open questions",
    icon: HelpCircle,
    emptyState: "No unresolved questions right now.",
  },
];

export function AttentionSection() {
  return (
    <section aria-labelledby="attention-heading">
      <h2 className="mb-3 text-base font-semibold" id="attention-heading">
        Attention
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {attentionCards.map((card) => (
          <AttentionCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
