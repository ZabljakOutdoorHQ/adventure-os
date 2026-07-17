import { describe, expect, test } from "bun:test";
import {
  allEntities,
  factValue,
  findEntity,
  relatedEntities,
  systemMapEdges,
} from "./data";

describe("demo data integrity", () => {
  test("every entity id is unique", () => {
    const ids = allEntities.map((entity) => entity.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every relatedId resolves to a real entity", () => {
    for (const entity of allEntities) {
      for (const relatedId of entity.relatedIds ?? []) {
        expect(findEntity(relatedId)).toBeDefined();
      }
    }
  });

  test("relatedEntities resolves the full related list, in order", () => {
    const entity = findEntity("org-durmitor");
    if (!entity) throw new Error("expected org-durmitor to exist");
    const related = relatedEntities(entity);
    expect(related.map((r) => r.id)).toEqual(entity.relatedIds ?? []);
  });

  test("factValue reads a fact by label and returns undefined otherwise", () => {
    const entity = findEntity("doc-sop-rafting");
    if (!entity) throw new Error("expected doc-sop-rafting to exist");
    expect(factValue(entity, "Source")).toBe("Docmost");
    expect(factValue(entity, "Nonexistent")).toBeUndefined();
  });

  test("system map edges have no self-edges and no duplicates", () => {
    const seen = new Set<string>();
    for (const edge of systemMapEdges) {
      expect(edge.from).not.toBe(edge.to);
      const key = [edge.from, edge.to].sort().join("::");
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});
