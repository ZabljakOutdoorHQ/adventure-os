import type { CanonicalTask } from "@/lib/tasks/types";
import { atTime, daysFromToday } from "./dates";
import type { DemoEdge, DemoEntity } from "./types";

// All content below is fictional demo data for the click-through prototype.
// It is not read from, or written to, any real system.

export const organisations: DemoEntity[] = [
  {
    id: "org-durmitor",
    kind: "organisation",
    title: "Durmitor Adventure",
    subtitle: "Core operating brand",
    description:
      "The primary outdoor operations brand — rafting, canyoning, via ferrata and multi-day treks around Durmitor and the Tara canyon.",
    facts: [
      { label: "Role", value: "Primary brand" },
      { label: "Base", value: "Žabljak, Montenegro" },
    ],
    relatedIds: [
      "person-boris",
      "person-ana",
      "project-canyon",
      "project-fleet",
    ],
    href: "/system-map",
  },
  {
    id: "org-multiday",
    kind: "organisation",
    title: "Multiday",
    subtitle: "Multi-day trek brand",
    description:
      "Multi-day trekking itineraries across the Balkans, currently mid-migration off Notion onto the shared Adventure OS knowledge graph.",
    facts: [
      { label: "Role", value: "Connected brand" },
      { label: "Status", value: "Transitional — Notion still authoritative" },
    ],
    relatedIds: ["person-jelena", "project-multiday", "booking-4"],
    href: "/system-map",
  },
  {
    id: "org-wildcollective",
    kind: "organisation",
    title: "Wild Collective",
    subtitle: "Partner organisation",
    description:
      "External partner organisation providing joint guiding capacity and cross-referral bookings under a shared partnership agreement.",
    facts: [
      { label: "Role", value: "Partner" },
      { label: "Relationship", value: "Confirmed" },
    ],
    relatedIds: ["person-partner", "project-partner", "doc-partner-agreement"],
    href: "/system-map",
  },
];

export const people: DemoEntity[] = [
  {
    id: "person-boris",
    kind: "person",
    title: "Boris Stijepovic",
    subtitle: "Founder & Operator",
    description: "Owns Durmitor Adventure end to end, from ops to strategy.",
    facts: [
      { label: "Organisation", value: "Durmitor Adventure" },
      { label: "Focus", value: "Strategy, fleet, partnerships" },
    ],
    relatedIds: ["org-durmitor", "project-fleet", "project-partner", "task-2"],
    href: "/system-map",
  },
  {
    id: "person-ana",
    kind: "person",
    title: "Ana Radulović",
    subtitle: "Operations Lead",
    description: "Runs day-to-day scheduling, guide rosters and bookings.",
    facts: [
      { label: "Organisation", value: "Durmitor Adventure" },
      { label: "Focus", value: "Scheduling & guide roster" },
    ],
    relatedIds: ["org-durmitor", "project-canyon", "task-1", "task-5"],
    href: "/system-map",
  },
  {
    id: "person-marko",
    kind: "person",
    title: "Marko Vuković",
    subtitle: "Head Guide",
    description: "Leads the guiding team and owns safety documentation.",
    facts: [
      { label: "Organisation", value: "Durmitor Adventure" },
      { label: "Focus", value: "Guiding standards & safety" },
    ],
    relatedIds: ["org-durmitor", "doc-sop-rafting", "task-3", "booking-2"],
    href: "/system-map",
  },
  {
    id: "person-jelena",
    kind: "person",
    title: "Jelena Popović",
    subtitle: "Guest Experience",
    description: "Owns guest communication and multi-day trek logistics.",
    facts: [
      { label: "Organisation", value: "Multiday" },
      { label: "Focus", value: "Guest experience & logistics" },
    ],
    relatedIds: ["org-multiday", "booking-4", "task-6"],
    href: "/system-map",
  },
  {
    id: "person-luka",
    kind: "person",
    title: "Luka Đorđević",
    subtitle: "Guide",
    description: "Recently onboarded guide, covering rafting and via ferrata.",
    facts: [
      { label: "Organisation", value: "Durmitor Adventure" },
      { label: "Focus", value: "Rafting & via ferrata" },
    ],
    relatedIds: ["org-durmitor", "booking-1", "booking-3"],
    href: "/system-map",
  },
  {
    id: "person-partner",
    kind: "person",
    title: "Nikolina Ilić",
    subtitle: "Partnerships, Wild Collective",
    description: "Primary contact for the Wild Collective partnership.",
    facts: [
      { label: "Organisation", value: "Wild Collective" },
      { label: "Focus", value: "Partnership coordination" },
    ],
    relatedIds: ["org-wildcollective", "project-partner", "message-3"],
    href: "/system-map",
  },
];

export const projects: DemoEntity[] = [
  {
    id: "project-canyon",
    kind: "project",
    title: "Tara Canyon Season Launch",
    subtitle: "Active · Durmitor Adventure",
    description:
      "Preparing the Tara canyon rafting and canyoning season: guide roster, safety review and fleet readiness.",
    facts: [
      { label: "Owner", value: "Ana Radulović" },
      { label: "Status", value: "In progress" },
    ],
    relatedIds: ["org-durmitor", "person-ana", "task-1", "booking-2"],
    href: "/tasks",
  },
  {
    id: "project-fleet",
    kind: "project",
    title: "Fleet Renewal 2026",
    subtitle: "Active · Durmitor Adventure",
    description:
      "Renewing rafts, vehicles and safety equipment ahead of peak season, including the supplier contract.",
    facts: [
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Status", value: "Contract under review" },
    ],
    relatedIds: [
      "org-durmitor",
      "person-boris",
      "task-2",
      "doc-fleet-contract",
    ],
    href: "/tasks",
  },
  {
    id: "project-partner",
    kind: "project",
    title: "Wild Collective Partnership",
    subtitle: "Active · cross-organisation",
    description:
      "Formalising the joint guiding and cross-referral partnership with Wild Collective.",
    facts: [
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Status", value: "Agreement in signature" },
    ],
    relatedIds: [
      "org-wildcollective",
      "person-partner",
      "task-4",
      "doc-partner-agreement",
    ],
    href: "/tasks",
  },
  {
    id: "project-multiday",
    kind: "project",
    title: "Multiday Migration",
    subtitle: "Active · Multiday",
    description:
      "Migrating Multiday's group, participant and payment data off Notion onto the shared knowledge graph.",
    facts: [
      { label: "Owner", value: "Jelena Popović" },
      { label: "Status", value: "Data audit in progress" },
    ],
    relatedIds: ["org-multiday", "person-jelena", "booking-4"],
    href: "/tasks",
  },
  {
    id: "project-mc",
    kind: "project",
    title: "Adventure OS",
    subtitle: "Active · internal",
    description:
      "The spatial operating layer itself — this prototype is part of validating its information architecture.",
    facts: [
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Status", value: "Prototype phase" },
    ],
    relatedIds: ["org-durmitor", "person-boris"],
    href: "/tasks",
  },
];

export const bookings: DemoEntity[] = [
  {
    id: "booking-1",
    kind: "booking",
    title: "Durmitor Rafting Group",
    subtitle: `${daysFromToday(0)} · 12 guests`,
    description: "Full-day rafting departure on the Tara canyon.",
    facts: [
      { label: "Guests", value: "12" },
      { label: "Guide", value: "Luka Đorđević" },
      { label: "Status", value: "Confirmed" },
    ],
    relatedIds: ["org-durmitor", "person-luka", "event-1"],
    href: "/operations",
  },
  {
    id: "booking-2",
    kind: "booking",
    title: "Tara Canyon Full-Day Tour",
    subtitle: `${daysFromToday(1)} · 6 guests`,
    description:
      "Guided canyon tour, part of the season-launch readiness check.",
    facts: [
      { label: "Guests", value: "6" },
      { label: "Guide", value: "Marko Vuković" },
      { label: "Status", value: "Confirmed" },
    ],
    relatedIds: ["org-durmitor", "person-marko", "project-canyon", "event-2"],
    href: "/operations",
  },
  {
    id: "booking-3",
    kind: "booking",
    title: "Via Ferrata Ćurevac",
    subtitle: `${daysFromToday(2)} · 4 guests`,
    description: "Small-group via ferrata ascent.",
    facts: [
      { label: "Guests", value: "4" },
      { label: "Guide", value: "Luka Đorđević" },
      { label: "Status", value: "Confirmed" },
    ],
    relatedIds: ["org-durmitor", "person-luka"],
    href: "/operations",
  },
  {
    id: "booking-4",
    kind: "booking",
    title: "Peaks of the Balkans Trek",
    subtitle: `${daysFromToday(5)}–${daysFromToday(10)} · 8 guests`,
    description: "Multi-day trek spanning Montenegro, Albania and Kosovo.",
    facts: [
      { label: "Guests", value: "8" },
      { label: "Lead", value: "Jelena Popović" },
      { label: "Status", value: "Logistics in progress" },
    ],
    relatedIds: [
      "org-multiday",
      "person-jelena",
      "project-multiday",
      "event-5",
    ],
    href: "/operations",
  },
];

export const documents: DemoEntity[] = [
  {
    id: "doc-sop-rafting",
    kind: "document",
    title: "Rafting Safety SOP",
    subtitle: "Docmost · Maintained",
    description: "Standard operating procedure for rafting trip safety.",
    facts: [
      { label: "Source", value: "Docmost" },
      { label: "Owner", value: "Marko Vuković" },
      { label: "Confidence", value: "Confirmed" },
    ],
    relatedIds: ["person-marko", "org-durmitor", "task-3", "message-5"],
    href: "/documents",
  },
  {
    id: "doc-fleet-contract",
    kind: "document",
    title: "Fleet Renewal Contract",
    subtitle: "Google Drive · Draft",
    description: "Supplier contract for the 2026 fleet renewal.",
    facts: [
      { label: "Source", value: "Google Drive" },
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Confidence", value: "Probable" },
    ],
    relatedIds: ["person-boris", "project-fleet", "task-2", "message-1"],
    href: "/documents",
  },
  {
    id: "doc-partner-agreement",
    kind: "document",
    title: "Wild Collective Partnership Agreement",
    subtitle: "Documenso · Pending signature",
    description: "Joint guiding and cross-referral partnership agreement.",
    facts: [
      { label: "Source", value: "Documenso" },
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Confidence", value: "Confirmed" },
    ],
    relatedIds: ["org-wildcollective", "project-partner", "task-4"],
    href: "/documents",
  },
  {
    id: "doc-guide-handbook",
    kind: "document",
    title: "Guide Handbook 2026",
    subtitle: "Docmost · Maintained",
    description: "Onboarding and standards reference for all guides.",
    facts: [
      { label: "Source", value: "Docmost" },
      { label: "Owner", value: "Marko Vuković" },
      { label: "Confidence", value: "Confirmed" },
    ],
    relatedIds: ["person-marko", "person-luka", "event-6"],
    href: "/documents",
  },
  {
    id: "doc-season-plan",
    kind: "document",
    title: "2026 Season Operating Plan",
    subtitle: "Google Drive · Maintained",
    description: "Season-level operating plan across all active brands.",
    facts: [
      { label: "Source", value: "Google Drive" },
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Confidence", value: "Confirmed" },
    ],
    relatedIds: ["org-durmitor", "person-boris", "message-6"],
    href: "/documents",
  },
  {
    id: "doc-adr-plane",
    kind: "document",
    title: "ADR: Adopt Plane for Tasks",
    subtitle: "GitHub · Decision record",
    description: "Architecture decision recording Plane as the task authority.",
    facts: [
      { label: "Source", value: "GitHub" },
      { label: "Owner", value: "Boris Stijepovic" },
      { label: "Confidence", value: "Confirmed" },
    ],
    relatedIds: ["org-durmitor"],
    href: "/documents",
  },
];

export const demoTasks: CanonicalTask[] = [
  {
    id: "demo:task-1",
    title: "Confirm guide roster for Tara Canyon launch",
    status: "started",
    priority: "high",
    dueDate: daysFromToday(1),
    startDate: daysFromToday(-2),
    assigneeIds: ["person-ana"],
    createdAt: atTime(-5, 9),
    updatedAt: atTime(-1, 15),
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "demo-task-1",
        title: "Tara Canyon Season Launch",
        observedAt: atTime(-1, 15),
      },
    ],
  },
  {
    id: "demo:task-2",
    title: "Review fleet renewal contract redlines",
    status: "unstarted",
    priority: "urgent",
    dueDate: daysFromToday(0),
    startDate: null,
    assigneeIds: ["person-boris"],
    createdAt: atTime(-3, 10),
    updatedAt: atTime(-1, 11),
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "demo-task-2",
        title: "Fleet Renewal 2026",
        observedAt: atTime(-1, 11),
      },
    ],
  },
  {
    id: "demo:task-3",
    title: "Publish updated rafting safety SOP",
    status: "backlog",
    priority: "medium",
    dueDate: null,
    startDate: null,
    assigneeIds: ["person-marko"],
    createdAt: atTime(-10, 9),
    updatedAt: atTime(-4, 9),
    archivedAt: null,
    sourceRefs: [
      {
        system: "docmost",
        objectType: "page",
        externalId: "demo-task-3",
        title: "Rafting Safety SOP",
        observedAt: atTime(-4, 9),
      },
    ],
  },
  {
    id: "demo:task-4",
    title: "Sign Wild Collective partnership agreement",
    status: "started",
    priority: "high",
    dueDate: daysFromToday(3),
    startDate: daysFromToday(-1),
    assigneeIds: ["person-boris"],
    createdAt: atTime(-6, 9),
    updatedAt: atTime(0, 8),
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "demo-task-4",
        title: "Wild Collective Partnership",
        observedAt: atTime(0, 8),
      },
    ],
  },
  {
    id: "demo:task-5",
    title: "Onboard Luka to guide scheduling",
    status: "completed",
    priority: "low",
    dueDate: daysFromToday(-4),
    startDate: daysFromToday(-9),
    assigneeIds: ["person-ana"],
    createdAt: atTime(-9, 9),
    updatedAt: atTime(-4, 17),
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "demo-task-5",
        title: "Durmitor Adventure",
        observedAt: atTime(-4, 17),
      },
    ],
  },
  {
    id: "demo:task-6",
    title: "Prepare Peaks of the Balkans logistics checklist",
    status: "unstarted",
    priority: "medium",
    dueDate: daysFromToday(5),
    startDate: null,
    assigneeIds: ["person-jelena"],
    createdAt: atTime(-2, 9),
    updatedAt: atTime(-1, 9),
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "demo-task-6",
        title: "Multiday Migration",
        observedAt: atTime(-1, 9),
      },
    ],
  },
];

const taskEntityFor = (
  task: CanonicalTask,
  relatedIds: string[],
): DemoEntity => ({
  id: task.id.split(":")[1],
  kind: "task",
  title: task.title,
  subtitle: task.sourceRefs[0]?.title,
  facts: [
    { label: "Status", value: task.status },
    { label: "Priority", value: task.priority ?? "none" },
    { label: "Due", value: task.dueDate ?? "No due date" },
  ],
  relatedIds,
  href: "/tasks",
});

export const taskEntities: DemoEntity[] = [
  taskEntityFor(demoTasks[0], ["person-ana", "project-canyon"]),
  taskEntityFor(demoTasks[1], [
    "person-boris",
    "project-fleet",
    "doc-fleet-contract",
  ]),
  taskEntityFor(demoTasks[2], ["person-marko", "doc-sop-rafting"]),
  taskEntityFor(demoTasks[3], [
    "person-boris",
    "project-partner",
    "doc-partner-agreement",
  ]),
  taskEntityFor(demoTasks[4], ["person-ana", "org-durmitor"]),
  taskEntityFor(demoTasks[5], ["person-jelena", "project-multiday"]),
];

export const messages: DemoEntity[] = [
  {
    id: "message-1",
    kind: "message",
    title: "Fleet supplier: renewal quote attached",
    subtitle: `Email · ${daysFromToday(-1)}`,
    description: "Supplier sent an updated quote for the fleet renewal.",
    facts: [
      { label: "Channel", value: "Gmail" },
      { label: "From", value: "supplier@fleetgear.example" },
    ],
    relatedIds: ["project-fleet", "doc-fleet-contract"],
    href: "/communications",
  },
  {
    id: "message-2",
    kind: "message",
    title: "Tara Canyon guide count confirmed?",
    subtitle: `Mattermost · ${daysFromToday(0)}`,
    description: "Thread confirming the guide count for tomorrow's tour.",
    facts: [
      { label: "Channel", value: "Mattermost" },
      { label: "Participants", value: "Ana Radulović, Marko Vuković" },
    ],
    relatedIds: ["booking-2", "person-marko"],
    href: "/communications",
  },
  {
    id: "message-3",
    kind: "message",
    title: "Wild Collective: contract redlines",
    subtitle: `Email · ${daysFromToday(-2)}`,
    description: "Partner sent redlines on the partnership agreement.",
    facts: [
      { label: "Channel", value: "Gmail" },
      { label: "From", value: "nikolina@wildcollective.example" },
    ],
    relatedIds: ["project-partner", "person-partner"],
    href: "/communications",
  },
  {
    id: "message-4",
    kind: "message",
    title: "Guest inquiry: Peaks of the Balkans availability",
    subtitle: `Email · ${daysFromToday(-1)}`,
    description: "Prospective guest asking about remaining spots.",
    facts: [
      { label: "Channel", value: "Gmail" },
      { label: "From", value: "guest@example.com" },
    ],
    relatedIds: ["booking-4", "person-jelena"],
    href: "/communications",
  },
  {
    id: "message-5",
    kind: "message",
    title: "Rafting SOP review comments",
    subtitle: `Mattermost · ${daysFromToday(-3)}`,
    description: "Feedback thread on the draft safety SOP update.",
    facts: [
      { label: "Channel", value: "Mattermost" },
      { label: "Participants", value: "Marko Vuković, Boris Stijepovic" },
    ],
    relatedIds: ["doc-sop-rafting", "person-marko"],
    href: "/communications",
  },
  {
    id: "message-6",
    kind: "message",
    title: "Season plan sign-off requested",
    subtitle: `Email · ${daysFromToday(0)}`,
    description: "Reminder to review and sign off the season operating plan.",
    facts: [
      { label: "Channel", value: "Gmail" },
      { label: "From", value: "boris@durmitoradventure.example" },
    ],
    relatedIds: ["doc-season-plan"],
    href: "/communications",
  },
];

export const events: DemoEntity[] = [
  {
    id: "event-1",
    kind: "event",
    title: "Durmitor Rafting Group departure",
    subtitle: "09:00",
    description: "Full-day rafting departure — meet at the base camp.",
    facts: [
      { label: "Date", value: daysFromToday(0) },
      { label: "Guide", value: "Luka Đorđević" },
    ],
    relatedIds: ["booking-1", "person-luka"],
    href: "/calendar",
  },
  {
    id: "event-2",
    kind: "event",
    title: "Tara Canyon Full-Day Tour",
    subtitle: "08:30",
    description: "Guided canyon tour departure.",
    facts: [
      { label: "Date", value: daysFromToday(1) },
      { label: "Guide", value: "Marko Vuković" },
    ],
    relatedIds: ["booking-2", "person-marko"],
    href: "/calendar",
  },
  {
    id: "event-3",
    kind: "event",
    title: "Fleet supplier call",
    subtitle: "14:00",
    description: "Call to walk through the renewal contract redlines.",
    facts: [
      { label: "Date", value: daysFromToday(0) },
      { label: "Attendee", value: "Boris Stijepovic" },
    ],
    relatedIds: ["project-fleet", "doc-fleet-contract"],
    href: "/calendar",
  },
  {
    id: "event-4",
    kind: "event",
    title: "Wild Collective partnership review",
    subtitle: "11:00",
    description: "Joint review call with Wild Collective.",
    facts: [
      { label: "Date", value: daysFromToday(2) },
      { label: "Attendee", value: "Nikolina Ilić" },
    ],
    relatedIds: ["project-partner", "person-partner"],
    href: "/calendar",
  },
  {
    id: "event-5",
    kind: "event",
    title: "Peaks of the Balkans trek start",
    subtitle: "07:00",
    description: "Multi-day trek departure.",
    facts: [
      { label: "Date", value: daysFromToday(5) },
      { label: "Lead", value: "Jelena Popović" },
    ],
    relatedIds: ["booking-4", "person-jelena"],
    href: "/calendar",
  },
  {
    id: "event-6",
    kind: "event",
    title: "Guide handbook review session",
    subtitle: "16:00",
    description: "Annual review of the guide handbook with the guiding team.",
    facts: [
      { label: "Date", value: daysFromToday(3) },
      { label: "Attendee", value: "Marko Vuković" },
    ],
    relatedIds: ["doc-guide-handbook", "person-marko"],
    href: "/calendar",
  },
];

export const allEntities: DemoEntity[] = [
  ...organisations,
  ...people,
  ...projects,
  ...bookings,
  ...documents,
  ...taskEntities,
  ...messages,
  ...events,
];

export function findEntity(id: string): DemoEntity | undefined {
  return allEntities.find((entity) => entity.id === id);
}

export function relatedEntities(entity: DemoEntity): DemoEntity[] {
  return (entity.relatedIds ?? [])
    .map((id) => findEntity(id))
    .filter((related): related is DemoEntity => related !== undefined);
}

// Edges for the System Map graph — deliberately limited to organisation,
// person, project, booking and document kinds so the graph stays legible.
const graphKinds = new Set([
  "organisation",
  "person",
  "project",
  "booking",
  "document",
]);

export const systemMapEdges: DemoEdge[] = (() => {
  const seen = new Set<string>();
  const edges: DemoEdge[] = [];
  for (const entity of allEntities) {
    if (!graphKinds.has(entity.kind)) continue;
    for (const relatedId of entity.relatedIds ?? []) {
      const related = findEntity(relatedId);
      if (!related || !graphKinds.has(related.kind)) continue;
      const key = [entity.id, related.id].sort().join("::");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from: entity.id, to: related.id, relation: "related" });
    }
  }
  return edges;
})();

export const systemMapNodes: DemoEntity[] = allEntities.filter((entity) =>
  graphKinds.has(entity.kind),
);

export function factValue(
  entity: DemoEntity,
  label: string,
): string | undefined {
  return entity.facts?.find((fact) => fact.label === label)?.value;
}

// Knowledge (maintained docs/decisions) vs Documents (files/agreements) is a
// source-system split within the same demo `documents` list — Docmost and
// GitHub content is "maintained knowledge", Drive and Documenso content is
// "files", matching docs/PROJECT_CONSTITUTION.md's authoritative-systems list.
export const knowledgeDocuments: DemoEntity[] = documents.filter((doc) =>
  ["Docmost", "GitHub"].includes(factValue(doc, "Source") ?? ""),
);

export const fileDocuments: DemoEntity[] = documents.filter((doc) =>
  ["Google Drive", "Documenso"].includes(factValue(doc, "Source") ?? ""),
);
