"use client";

import {
  AlertTriangle,
  CalendarDays,
  Command,
  LayoutDashboard,
  Network,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  attentionItems,
  organisations,
  people,
  projects,
  type ViewKey,
} from "@/lib/mock-data";

const navItems: Array<{ key: ViewKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "today", label: "Today", icon: LayoutDashboard },
  { key: "matrix", label: "Matrix", icon: Command },
  { key: "projects", label: "Projects", icon: CalendarDays },
  { key: "people", label: "People & graph", icon: Network },
];

function TodayView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {attentionItems.map((item) => (
          <article className="rounded-2xl border bg-[var(--card)] p-4" key={item.title}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">{item.title}</span>
              <span className={`status-dot status-${item.level}`} />
            </div>
            <strong className="block text-lg">Needs attention</strong>
            <p className="mb-0 text-sm leading-6 text-[var(--muted-foreground)]">{item.detail}</p>
          </article>
        ))}
      </div>
      <section className="rounded-2xl border bg-[var(--card)] p-5">
        <p className="eyebrow">Current operating picture</p>
        <h2>What is moving across the system</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <article className="rounded-xl bg-[var(--background)] p-4" key={project.id}>
              <span className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{project.status}</span>
              <h3>{project.name}</h3>
              <p>{project.nextStep}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MatrixView() {
  return (
    <section className="rounded-2xl border bg-[var(--card)] p-5">
      <p className="eyebrow">Spatial workspace</p>
      <h2>Organisation × active work × attention</h2>
      <div className="matrix-grid mt-5">
        {organisations.map((organisation) => (
          <article className="matrix-card" key={organisation.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">{organisation.activeProjects} active</span>
                <h3>{organisation.name}</h3>
              </div>
              <span className={`status-dot status-${organisation.attention}`} />
            </div>
            <p>{organisation.focus}</p>
            <div className="mt-auto space-y-2">
              {projects
                .filter((project) => project.organisationId === organisation.id)
                .slice(0, 2)
                .map((project) => (
                  <div className="rounded-lg border bg-[var(--card)] px-3 py-2 text-xs" key={project.id}>
                    {project.name}
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsView() {
  return (
    <section className="rounded-2xl border bg-[var(--card)] p-5">
      <p className="eyebrow">Portfolio</p>
      <h2>Active projects and next decisions</h2>
      <div className="mt-5 space-y-3">
        {projects.map((project) => {
          const organisation = organisations.find((item) => item.id === project.organisationId);
          return (
            <article className="project-row" key={project.id}>
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">{organisation?.name}</span>
                <h3>{project.name}</h3>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">Next step</span>
                <p>{project.nextStep}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted-foreground)]">Owner</span>
                <p>{project.owner}</p>
              </div>
              <span className="rounded-full border px-3 py-1 text-xs capitalize">{project.status}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PeopleView() {
  return (
    <section className="rounded-2xl border bg-[var(--card)] p-5">
      <p className="eyebrow">Relationship layer</p>
      <h2>People connected to organisations and work</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {people.map((person) => (
          <article className="rounded-2xl bg-[var(--background)] p-4" key={person.id}>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {person.connectedTo.map((connection) => {
                const label =
                  organisations.find((item) => item.id === connection)?.name ??
                  projects.find((item) => item.id === connection)?.name ??
                  connection;
                return (
                  <span className="rounded-full border bg-[var(--card)] px-3 py-1 text-xs" key={connection}>
                    {label}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AdventureShell() {
  const [activeView, setActiveView] = useState<ViewKey>("today");
  const [query, setQuery] = useState("");

  const activeLabel = navItems.find((item) => item.key === activeView)?.label ?? "Today";
  const searchMatches = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return [];
    return [
      ...projects.map((item) => ({ type: "Project", label: item.name })),
      ...people.map((item) => ({ type: "Person", label: item.name })),
      ...organisations.map((item) => ({ type: "Organisation", label: item.name })),
    ]
      .filter((item) => item.label.toLowerCase().includes(normalised))
      .slice(0, 6);
  }, [query]);

  return (
    <main className="app-shell">
      <aside className="primary-sidebar">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--foreground)] text-white">
            <Command size={19} />
          </div>
          <div>
            <strong className="block">Adventure OS</strong>
            <span className="text-xs text-[var(--muted-foreground)]">Command centre</span>
          </div>
        </div>
        <nav className="space-y-1" aria-label="Primary navigation">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              className={`nav-button ${activeView === key ? "nav-button-active" : ""}`}
              key={key}
              onClick={() => setActiveView(key)}
              type="button"
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border bg-[var(--background)] p-3 text-xs text-[var(--muted-foreground)]">
          <strong className="mb-1 block text-[var(--foreground)]">Prototype mode</strong>
          Mock data only. No production systems are connected.
        </div>
      </aside>

      <section className="main-workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{activeLabel}</p>
            <h1>Good afternoon, Boris</h1>
          </div>
          <div className="relative">
            <label className="search-box">
              <Search size={16} />
              <input
                aria-label="Search Adventure OS"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search people, projects, groups…"
                value={query}
              />
            </label>
            {searchMatches.length > 0 && (
              <div className="search-results">
                {searchMatches.map((item) => (
                  <button key={`${item.type}-${item.label}`} type="button">
                    <span>{item.type}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        {activeView === "today" && <TodayView />}
        {activeView === "matrix" && <MatrixView />}
        {activeView === "projects" && <ProjectsView />}
        {activeView === "people" && <PeopleView />}
      </section>

      <aside className="ai-sidebar">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)]">
            <Sparkles size={17} />
          </div>
          <div>
            <strong className="block text-sm">AI workspace</strong>
            <span className="text-xs text-[var(--muted-foreground)]">Read-only prototype</span>
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--background)] p-4 text-sm leading-6">
          Ask across projects without losing your current position in <strong>{activeLabel}</strong>.
        </div>
        <div className="mt-4 rounded-2xl border p-4 text-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle size={15} />
            <strong>Agent boundary</strong>
          </div>
          <p className="m-0 text-[var(--muted-foreground)]">
            It may search, summarise and propose. It cannot send, delete, pay or publish.
          </p>
        </div>
        <div className="mt-auto">
          <textarea aria-label="Ask Adventure OS" placeholder="What needs my attention today?" />
          <button className="primary-action" type="button">
            Ask Adventure OS
          </button>
        </div>
      </aside>
    </main>
  );
}
