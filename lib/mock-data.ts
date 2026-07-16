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
  { id: "da", name: "Durmitor Adventure", focus: "Daily operations, tours, fleet and sales", activeProjects: 8, attention: "urgent" },
  { id: "multiday", name: "Multiday", focus: "Groups, hotels, transfers, payments and bikes", activeProjects: 5, attention: "watch" },
  { id: "wild", name: "Wild Collective", focus: "Production, stories and partnerships", activeProjects: 3, attention: "normal" },
  { id: "xelements", name: "XElements", focus: "Race production, partners and logistics", activeProjects: 6, attention: "watch" },
  { id: "wbata", name: "WBATA", focus: "Association, members and regional projects", activeProjects: 4, attention: "normal" },
  { id: "discover", name: "DiscoverMNE", focus: "Product, partnerships and grants", activeProjects: 2, attention: "normal" },
];

export const projects: Project[] = [
  { id: "site", name: "New DA website", organisationId: "da", status: "active", nextStep: "Finish content and launch checklist", owner: "Boris" },
  { id: "yaron", name: "Yaron group", organisationId: "multiday", status: "active", nextStep: "Verify payments and bike allocation", owner: "Boris" },
  { id: "xelements-2026", name: "XElements 2026", organisationId: "xelements", status: "planning", nextStep: "Lock production timeline", owner: "Core team" },
  { id: "server", name: "Internal infrastructure", organisationId: "da", status: "active", nextStep: "Complete app deployment and backup validation", owner: "IT" },
  { id: "documentary", name: "Ski history documentary", organisationId: "wild", status: "waiting", nextStep: "Confirm partners and archive sources", owner: "Wild Collective" },
  { id: "ipa", name: "IPA cross-border proposal", organisationId: "discover", status: "planning", nextStep: "Confirm Serbian partner", owner: "Boris" },
];

export const people: Person[] = [
  { id: "boris", name: "Boris Stijepović", role: "Owner / product lead", connectedTo: ["da", "multiday", "wild", "xelements", "wbata", "discover"] },
  { id: "misa", name: "Miša", role: "Frontend developer", connectedTo: ["da", "discover"] },
  { id: "andrija", name: "Andrija Šćepanović", role: "Sampas partner", connectedTo: ["multiday"] },
  { id: "dejan", name: "Dejan Radonjić", role: "Other Trails partner", connectedTo: ["multiday"] },
  { id: "yaron-person", name: "Yaron", role: "Tour leader", connectedTo: ["multiday", "yaron"] },
];

export const attentionItems = [
  { title: "Multiday groups", detail: "2 groups need rooming, bike and payment checks", level: "urgent" as const },
  { title: "Website launch", detail: "Content completeness and legal/booking checks remain", level: "watch" as const },
  { title: "Internal services", detail: "Backup validation and production access rules remain", level: "watch" as const },
];
