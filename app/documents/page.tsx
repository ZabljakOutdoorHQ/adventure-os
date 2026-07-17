import { FileSignature, FileText } from "lucide-react";
import { EntitySectionCard } from "@/components/demo/entity-section-card";
import { SectionHeader } from "@/components/demo/section-header";
import { factValue, fileDocuments } from "@/lib/demo/data";

export default function DocumentsPage() {
  const drive = fileDocuments.filter(
    (doc) => factValue(doc, "Source") === "Google Drive",
  );
  const signed = fileDocuments.filter(
    (doc) => factValue(doc, "Source") === "Documenso",
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Files and agreements from Google Drive and Documenso, connected to the people and projects they relate to. Demo data only."
        eyebrow="Documents"
        title="Documents"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <EntitySectionCard icon={FileText} items={drive} title="Drive files" />
        <EntitySectionCard
          icon={FileSignature}
          items={signed}
          title="Agreements"
        />
      </div>
    </div>
  );
}
