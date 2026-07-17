import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoEntity } from "@/lib/demo/types";
import { EntityList } from "./entity-list";

export function EntitySectionCard({
  icon: Icon,
  title,
  items,
  emptyLabel,
}: {
  icon: LucideIcon;
  title: string;
  items: DemoEntity[];
  emptyLabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 pb-2">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Icon size={15} />
        </div>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <EntityList items={items} />
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            {emptyLabel ?? "Nothing here yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
