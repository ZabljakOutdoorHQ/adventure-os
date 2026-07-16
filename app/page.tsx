import {
  AlertTriangle,
  Bike,
  CalendarDays,
  CircleDollarSign,
  Command,
  LayoutDashboard,
  Network,
  Search,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Today", icon: LayoutDashboard, active: true },
  { label: "Matrix", icon: Command },
  { label: "Projects", icon: CalendarDays },
  { label: "People & graph", icon: Network },
];

const signals = [
  {
    title: "Multiday operations",
    value: "2 groups need attention",
    detail: "Rooming, bike allocation and payment checks",
    icon: Bike,
  },
  {
    title: "Outstanding payments",
    value: "7 records to verify",
    detail: "Mock data — source integrations are not connected",
    icon: CircleDollarSign,
  },
  {
    title: "Operational risks",
    value: "3 items",
    detail: "Waivers, weather window and supplier confirmation",
    icon: AlertTriangle,
  },
];

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-[240px_minmax(0,1fr)_320px] gap-3 p-3">
      <aside className="flex flex-col rounded-[var(--radius)] border bg-[var(--card)] p-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--foreground)] text-white">
            <Command size={19} />
          </div>
          <div>
            <strong className="block">Adventure OS</strong>
            <span className="text-xs text-[var(--muted-foreground)]">Command centre</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                active ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : "text-[var(--muted-foreground)]"
              }`}
              key={label}
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

      <section className="min-w-0 rounded-[var(--radius)] border bg-[var(--card)] p-6">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm text-[var(--muted-foreground)]">Thursday · Overview</p>
            <h1 className="m-0 text-3xl tracking-tight">Good afternoon, Boris</h1>
          </div>
          <label className="flex min-w-72 items-center gap-2 rounded-xl border bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--muted-foreground)]">
            <Search size={16} />
            <input
              aria-label="Search Adventure OS"
              className="w-full border-0 bg-transparent outline-none"
              placeholder="Search people, projects, groups…"
            />
          </label>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-4">
          {signals.map(({ title, value, detail, icon: Icon }) => (
            <article className="rounded-2xl border p-4" key={title}>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">{title}</span>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--muted)]">
                  <Icon size={17} />
                </div>
              </div>
              <strong className="block text-xl">{value}</strong>
              <p className="mb-0 text-sm leading-5 text-[var(--muted-foreground)]">{detail}</p>
            </article>
          ))}
        </div>

        <section className="rounded-2xl border p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-[var(--muted-foreground)]">Spatial workspace</p>
              <h2 className="m-0 text-xl">Organisation × project × status</h2>
            </div>
            <button className="rounded-xl border px-3 py-2 text-sm" type="button">
              Open Matrix
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {["Durmitor Adventure", "Wild Collective", "XElements", "WBATA"].map((domain, index) => (
              <div className="min-h-36 rounded-2xl bg-[var(--background)] p-4" key={domain}>
                <div className="mb-8 flex items-center justify-between">
                  <strong className="text-sm">{domain}</strong>
                  <span className="text-xs text-[var(--muted-foreground)]">0{index + 1}</span>
                </div>
                <div className="space-y-2 text-xs text-[var(--muted-foreground)]">
                  <div className="rounded-lg bg-white px-2 py-1.5">Active work</div>
                  <div className="rounded-lg bg-white px-2 py-1.5">Related people</div>
                  <div className="rounded-lg bg-white px-2 py-1.5">Next decisions</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="flex flex-col rounded-[var(--radius)] border bg-[var(--card)] p-4">
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
          Ask across projects without losing your current position in the dashboard.
        </div>

        <div className="mt-auto">
          <textarea
            aria-label="Ask Adventure OS"
            className="min-h-28 w-full resize-none rounded-2xl border bg-[var(--background)] p-3 text-sm outline-none"
            placeholder="What needs my attention today?"
          />
          <button className="mt-2 w-full rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm text-white" type="button">
            Ask Adventure OS
          </button>
        </div>
      </aside>
    </main>
  );
}
