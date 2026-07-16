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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  attentionItems,
  organisations,
  people,
  projects,
  type ViewKey,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navItems: Array<{
  key: ViewKey;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { key: "today", label: "Today", icon: LayoutDashboard },
  { key: "matrix", label: "Matrix", icon: Command },
  { key: "projects", label: "Projects", icon: CalendarDays },
  { key: "people", label: "People & graph", icon: Network },
];

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">{eyebrow}</p>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TodayView() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {attentionItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">
                {item.title}
              </span>
              <span className={`status-dot status-${item.level}`} />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Needs attention</CardTitle>
              <p className="mb-0 text-sm leading-6 text-[var(--muted-foreground)]">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <SectionCard
        eyebrow="Current operating picture"
        title="What is moving across the system"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Card
              className="bg-[var(--background)] shadow-none"
              key={project.id}
            >
              <CardContent className="p-4">
                <span className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  {project.status}
                </span>
                <h3>{project.name}</h3>
                <p>{project.nextStep}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MatrixView() {
  return (
    <SectionCard
      eyebrow="Spatial workspace"
      title="Organisation × active work × attention"
    >
      <div className="matrix-grid">
        {organisations.map((organisation) => (
          <Card
            className="matrix-card bg-[var(--background)] shadow-none"
            key={organisation.id}
          >
            <CardContent className="flex h-full flex-col p-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {organisation.activeProjects} active
                  </span>
                  <h3>{organisation.name}</h3>
                </div>
                <span
                  className={`status-dot status-${organisation.attention}`}
                />
              </div>
              <p>{organisation.focus}</p>
              <div className="mt-auto space-y-2">
                {projects
                  .filter(
                    (project) => project.organisationId === organisation.id,
                  )
                  .slice(0, 2)
                  .map((project) => (
                    <div
                      className="rounded-lg border bg-[var(--card)] px-3 py-2 text-xs"
                      key={project.id}
                    >
                      {project.name}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

function ProjectsView() {
  return (
    <SectionCard eyebrow="Portfolio" title="Active projects and next decisions">
      <div className="space-y-3">
        {projects.map((project) => {
          const organisation = organisations.find(
            (item) => item.id === project.organisationId,
          );
          return (
            <Card
              className="bg-[var(--background)] shadow-none"
              key={project.id}
            >
              <CardContent className="project-row bg-transparent p-4">
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {organisation?.name}
                  </span>
                  <h3>{project.name}</h3>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Next step
                  </span>
                  <p>{project.nextStep}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Owner
                  </span>
                  <p>{project.owner}</p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs capitalize">
                  {project.status}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionCard>
  );
}

function PeopleView() {
  return (
    <SectionCard
      eyebrow="Relationship layer"
      title="People connected to organisations and work"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {people.map((person) => (
          <Card className="bg-[var(--background)] shadow-none" key={person.id}>
            <CardContent className="p-4">
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {person.connectedTo.map((connection) => {
                  const label =
                    organisations.find((item) => item.id === connection)
                      ?.name ??
                    projects.find((item) => item.id === connection)?.name ??
                    connection;
                  return (
                    <span
                      className="rounded-full border bg-[var(--card)] px-3 py-1 text-xs"
                      key={connection}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

export function AdventureShell() {
  const [activeView, setActiveView] = useState<ViewKey>("today");
  const [query, setQuery] = useState("");
  const activeLabel =
    navItems.find((item) => item.key === activeView)?.label ?? "Today";
  const searchMatches = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return [];
    return [
      ...projects.map((item) => ({ type: "Project", label: item.name })),
      ...people.map((item) => ({ type: "Person", label: item.name })),
      ...organisations.map((item) => ({
        type: "Organisation",
        label: item.name,
      })),
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
            <span className="text-xs text-[var(--muted-foreground)]">
              Command centre
            </span>
          </div>
        </div>
        <nav className="space-y-1" aria-label="Primary navigation">
          {navItems.map(({ key, label, icon: Icon }) => (
            <Button
              className={cn(
                "w-full justify-start gap-3",
                activeView === key &&
                  "bg-[var(--accent)] text-[var(--accent-foreground)]",
              )}
              key={key}
              onClick={() => setActiveView(key)}
              variant="ghost"
            >
              <Icon size={17} />
              {label}
            </Button>
          ))}
        </nav>
        <Card className="mt-auto bg-[var(--background)] shadow-none">
          <CardContent className="p-3 text-xs text-[var(--muted-foreground)]">
            <strong className="mb-1 block text-[var(--foreground)]">
              Prototype mode
            </strong>
            Mock data only. No production systems are connected.
          </CardContent>
        </Card>
      </aside>

      <section className="main-workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{activeLabel}</p>
            <h1>Good afternoon, Boris</h1>
          </div>
          <div className="relative min-w-[290px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                size={16}
              />
              <Input
                aria-label="Search Adventure OS"
                className="pl-9"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search people, projects, groups…"
                value={query}
              />
            </div>
            {searchMatches.length > 0 && (
              <Card className="search-results">
                {searchMatches.map((item) => (
                  <Button
                    className="h-auto w-full justify-start py-2 text-left"
                    key={`${item.type}-${item.label}`}
                    variant="ghost"
                  >
                    <span className="mr-2 text-[10px] uppercase text-[var(--muted-foreground)]">
                      {item.type}
                    </span>
                    {item.label}
                  </Button>
                ))}
              </Card>
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
            <span className="text-xs text-[var(--muted-foreground)]">
              Read-only prototype
            </span>
          </div>
        </div>
        <Card className="bg-[var(--background)] shadow-none">
          <CardContent className="p-4 text-sm leading-6">
            Ask across projects without losing your current position in{" "}
            <strong>{activeLabel}</strong>.
          </CardContent>
        </Card>
        <Card className="mt-4 shadow-none">
          <CardContent className="p-4 text-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={15} />
              <strong>Agent boundary</strong>
            </div>
            <p className="m-0 text-[var(--muted-foreground)]">
              It may search, summarise and propose. It cannot send, delete, pay
              or publish.
            </p>
          </CardContent>
        </Card>
        <div className="mt-auto">
          <textarea
            aria-label="Ask Adventure OS"
            placeholder="What needs my attention today?"
          />
          <Button className="mt-2 w-full">Ask Adventure OS</Button>
        </div>
      </aside>
    </main>
  );
}
