import { BookOpen, GitBranch } from "lucide-react";
import { EntitySectionCard } from "@/components/demo/entity-section-card";
import { SectionHeader } from "@/components/demo/section-header";
import { knowledgeDocuments } from "@/lib/demo/data";

export default function KnowledgePage() {
  const documentation = knowledgeDocuments.filter((doc) =>
    doc.subtitle?.startsWith("Docmost"),
  );
  const decisions = knowledgeDocuments.filter((doc) =>
    doc.subtitle?.startsWith("GitHub"),
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Maintained internal documentation from Docmost and versioned architecture decisions from GitHub — indexed here, not duplicated. Demo data only."
        eyebrow="Knowledge"
        title="Knowledge"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <EntitySectionCard
          icon={BookOpen}
          items={documentation}
          title="Documentation"
        />
        <EntitySectionCard
          icon={GitBranch}
          items={decisions}
          title="Decisions"
        />
      </div>
    </div>
  );
}
