export type ViewKey = "today" | "matrix" | "projects" | "people";

export type Organisation = {
  id: string;
  name: string;
  focus: string;
  activeProjects: number;
  attention: "normal" | "watch" | "urgent";
};

export type Project = {
  id: string;
  name: string;
  organisationId: string;
  status: "active" | "waiting" | "planning";
  nextStep: string;
  owner: string;
};

export type Person = {
  id: string;
  name: string;
  role: string;
  connectedTo: string[];
};

export const organisations: Organisation[] = [
  {
    id: "da",
    name: "Durmitor Adventure",
    focus: "Agency layer, daily operations, shared overhead and system fee",
    activeProjects: 8,
    attention: "urgent",
  },
  {
    id: "multiday",
    name: "Multiday",
    focus: "WeTravel migration, groups, hotels, transfers and settlements",
    activeProjects: 5,
    attention: "watch",
  },
  {
    id: "wild",
    name: "Wild Collective",
    focus: "Production, stories and partnerships",
    activeProjects: 3,
    attention: "normal",
  },
  {
    id: "xelements",
    name: "XElements",
    focus: "Race production, partners and logistics",
    activeProjects: 6,
    attention: "watch",
  },
  {
    id: "wbata",
    name: "WBATA",
    focus: "Association, members and regional projects",
    activeProjects: 4,
    attention: "normal",
  },
  {
    id: "discover",
    name: "DiscoverMNE",
    focus: "Product, partnerships and grants",
    activeProjects: 2,
    attention: "normal",
  },
];

export const projects: Project[] = [
  {
    id: "site",
    name: "New DA website",
    organisationId: "da",
    status: "active",
    nextStep: "Finish content and launch checklist",
    owner: "Boris",
  },
  {
    id: "adventure-os",
    name: "Adventure OS",
    organisationId: "da",
    status: "active",
    nextStep: "Ship visual system map and preview",
    owner: "Boris + AI",
  },
  {
    id: "wetravel",
    name: "WeTravel migration",
    organisationId: "multiday",
    status: "planning",
    nextStep: "Map booking and payment lifecycle",
    owner: "Boris",
  },
  {
    id: "xelements-2026",
    name: "XElements 2026",
    organisationId: "xelements",
    status: "planning",
    nextStep: "Lock production timeline",
    owner: "Core team",
  },
  {
    id: "server",
    name: "Internal infrastructure",
    organisationId: "da",
    status: "active",
    nextStep: "Complete app deployment and backup validation",
    owner: "IT",
  },
  {
    id: "documentary",
    name: "Ski history documentary",
    organisationId: "wild",
    status: "waiting",
    nextStep: "Confirm partners and archive sources",
    owner: "Wild Collective",
  },
  {
    id: "ipa",
    name: "IPA cross-border proposal",
    organisationId: "discover",
    status: "planning",
    nextStep: "Confirm Serbian partner",
    owner: "Boris",
  },
];

export const people: Person[] = [
  {
    id: "boris",
    name: "Boris Stijović",
    role: "Owner / product lead",
    connectedTo: ["da", "multiday", "wild", "xelements", "wbata", "discover"],
  },
  {
    id: "misa",
    name: "Miša",
    role: "Frontend developer",
    connectedTo: ["da", "discover"],
  },
  {
    id: "borko",
    name: "Borko",
    role: "Infrastructure",
    connectedTo: ["da", "server"],
  },
  {
    id: "andrija",
    name: "Andrija Šćepanović",
    role: "Sampas partner",
    connectedTo: ["multiday"],
  },
  {
    id: "dejan",
    name: "Dejan Radonjić",
    role: "Other Trails partner",
    connectedTo: ["multiday"],
  },
];

export const attentionItems = [
  {
    title: "Adventure OS",
    detail:
      "Functional shell, shadcn foundation and preview are the current delivery path",
    level: "urgent" as const,
  },
  {
    title: "Multiday migration",
    detail:
      "WeTravel should become the system of record before further Notion expansion",
    level: "watch" as const,
  },
  {
    title: "Internal services",
    detail: "Backup validation and production access rules remain",
    level: "watch" as const,
  },
];
