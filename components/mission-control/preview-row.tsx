import type { LucideIcon } from "lucide-react";

export type PreviewRowItem = {
  title: string;
  icon: LucideIcon;
  emptyState: string;
};

export function PreviewRow({ title, icon: Icon, emptyState }: PreviewRowItem) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)]">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {emptyState}
        </p>
      </div>
    </div>
  );
}
