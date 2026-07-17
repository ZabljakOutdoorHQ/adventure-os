import { cn } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return <span className={cn("demo-badge", className)}>Demo data</span>;
}
