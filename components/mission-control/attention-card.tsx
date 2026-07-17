import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type AttentionCardProps = {
  title: string;
  icon: LucideIcon;
  emptyState: string;
};

export function AttentionCard({
  title,
  icon: Icon,
  emptyState,
}: AttentionCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center gap-2 pb-2">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Icon size={15} />
        </div>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-[var(--muted-foreground)]">{emptyState}</p>
      </CardContent>
    </Card>
  );
}
