"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/demo/demo-badge";
import {
  entityKindDestinationLabel,
  entityKindIcon,
  entityKindLabel,
} from "@/components/demo/entity-meta";
import { relatedEntities } from "@/lib/demo/data";
import type { DemoEntity } from "@/lib/demo/types";
import { useContextSelection } from "./context-selection";

export function EntityDetail({ entity }: { entity: DemoEntity }) {
  const { select, clear } = useContextSelection();
  const Icon = entityKindIcon[entity.kind];
  const related = relatedEntities(entity);

  return (
    <div className="entity-detail">
      <div className="entity-detail-header">
        <div className="context-panel-icon">
          <Icon size={18} />
        </div>
        <Button
          aria-label="Clear selection"
          onClick={clear}
          size="icon"
          variant="ghost"
        >
          <X size={16} />
        </Button>
      </div>

      <p className="eyebrow">{entityKindLabel[entity.kind]}</p>
      <h2 className="entity-detail-title">{entity.title}</h2>
      {entity.subtitle && (
        <p className="entity-detail-subtitle">{entity.subtitle}</p>
      )}
      {entity.description && (
        <p className="context-panel-body">{entity.description}</p>
      )}

      {entity.facts && entity.facts.length > 0 && (
        <dl className="entity-detail-facts">
          {entity.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {entity.href && (
        <Button asChild size="sm" variant="outline">
          <Link href={entity.href}>
            {entityKindDestinationLabel[entity.kind]}
          </Link>
        </Button>
      )}

      {related.length > 0 && (
        <div className="entity-detail-related">
          <p className="entity-detail-related-title">Related</p>
          <ul>
            {related.map((relatedEntity) => {
              const RelatedIcon = entityKindIcon[relatedEntity.kind];
              return (
                <li key={relatedEntity.id}>
                  <button onClick={() => select(relatedEntity)} type="button">
                    <RelatedIcon size={14} />
                    <span>{relatedEntity.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <DemoBadge className="entity-detail-badge" />
    </div>
  );
}
