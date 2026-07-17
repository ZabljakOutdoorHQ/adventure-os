import { HelpCircle, Sparkles, Users } from "lucide-react";
import { getTaskService } from "@/lib/task-service-provider";
import { resolveWaitingForMeViewState } from "@/lib/tasks";
import { AttentionCard } from "./attention-card";
import { WaitingForMeCard } from "./waiting-for-me-card";

const staticCards = [
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

// Async Server Component — getTaskService() only ever runs server-side (see
// lib/task-service-provider.ts's "server-only" import), so PLANE_API_KEY
// never reaches a client bundle.
export async function AttentionSection() {
  const waitingForMe = await resolveWaitingForMeViewState(getTaskService());

  return (
    <section aria-labelledby="attention-heading">
      <h2 className="mb-3 text-base font-semibold" id="attention-heading">
        Attention
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WaitingForMeCard result={waitingForMe} />
        {staticCards.map((card) => (
          <AttentionCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
