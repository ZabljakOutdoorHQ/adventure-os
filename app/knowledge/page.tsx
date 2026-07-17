import { BookOpen, FileText, GitBranch } from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function KnowledgePage() {
  return (
    <PagePlaceholder
      description="Maintained documentation, procedures and decisions from Docmost, Google Drive and GitHub — indexed, not duplicated."
      eyebrow="Knowledge"
      regions={[
        {
          title: "Documentation",
          description:
            "Maintained internal wiki content from Docmost, connected to the projects and teams it describes.",
          icon: BookOpen,
        },
        {
          title: "Documents",
          description:
            "Files and pages from Google Drive, with source, freshness and confidence shown on every result.",
          icon: FileText,
        },
        {
          title: "Decisions",
          description:
            "Architecture and product decisions recorded as ADRs in GitHub — the source of truth for how Adventure OS works.",
          icon: GitBranch,
        },
      ]}
      title="Knowledge"
    />
  );
}
