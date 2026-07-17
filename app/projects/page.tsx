import { CheckCircle2, FolderKanban, ListChecks } from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function ProjectsPage() {
  return (
    <PagePlaceholder
      description="Active projects, owners, next actions and the work moving across every brand — Adventure OS, Multiday, Wild Collective, XElements and connected initiatives."
      eyebrow="Projects"
      regions={[
        {
          title: "Portfolio",
          description:
            "Every active project with its owner, status and lifecycle, once projects are connected from Plane.",
          icon: FolderKanban,
        },
        {
          title: "Next actions",
          description:
            "The next decision or step for each project, pulled from tasks and notes.",
          icon: ListChecks,
        },
        {
          title: "Recently completed",
          description:
            "Work that shipped, for a clear record of momentum across the portfolio.",
          icon: CheckCircle2,
        },
      ]}
      title="Projects"
    />
  );
}
