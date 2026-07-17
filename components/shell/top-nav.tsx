"use client";

import { Command, PanelRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./global-search";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNav({ onToggleContext }: { onToggleContext: () => void }) {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="top-nav-brand">
        <div className="top-nav-mark">
          <Command size={18} />
        </div>
        <div>
          <strong className="block leading-none">Adventure OS</strong>
          <span className="text-xs text-[var(--muted-foreground)]">
            Mission Control
          </span>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="top-nav-links">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Button
              aria-current={active ? "page" : undefined}
              asChild
              className={cn(
                "gap-2",
                active && "bg-[var(--accent)] text-[var(--accent-foreground)]",
              )}
              key={item.href}
              size="sm"
              variant="ghost"
            >
              <Link href={item.href}>
                <item.icon size={16} />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="top-nav-actions">
        <GlobalSearch />
        <Button
          aria-label="Toggle context panel"
          className="context-toggle"
          onClick={onToggleContext}
          size="icon"
          variant="outline"
        >
          <PanelRight size={17} />
        </Button>
      </div>
    </header>
  );
}
