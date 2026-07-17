"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { DemoEntity } from "@/lib/demo/types";

type ContextSelectionValue = {
  selected: DemoEntity | null;
  select: (entity: DemoEntity) => void;
  clear: () => void;
};

const ContextSelectionContext = createContext<ContextSelectionValue | null>(
  null,
);

export function ContextSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<DemoEntity | null>(null);

  const value = useMemo<ContextSelectionValue>(
    () => ({
      selected,
      select: setSelected,
      clear: () => setSelected(null),
    }),
    [selected],
  );

  return (
    <ContextSelectionContext.Provider value={value}>
      {children}
    </ContextSelectionContext.Provider>
  );
}

export function useContextSelection(): ContextSelectionValue {
  const context = useContext(ContextSelectionContext);
  if (!context) {
    throw new Error(
      "useContextSelection must be used within a ContextSelectionProvider",
    );
  }
  return context;
}
