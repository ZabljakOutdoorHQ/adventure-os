import {
  Building2,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  Mail,
  type LucideIcon,
  User,
} from "lucide-react";
import type { DemoEntityKind } from "@/lib/demo/types";

export const entityKindIcon: Record<DemoEntityKind, LucideIcon> = {
  person: User,
  organisation: Building2,
  project: FolderKanban,
  booking: CalendarCheck2,
  document: FileText,
  task: CheckCircle2,
  message: Mail,
  event: CalendarDays,
};

export const entityKindLabel: Record<DemoEntityKind, string> = {
  person: "Person",
  organisation: "Organisation",
  project: "Project",
  booking: "Booking",
  document: "Document",
  task: "Task",
  message: "Message",
  event: "Event",
};

export const entityKindPluralLabel: Record<DemoEntityKind, string> = {
  person: "People",
  organisation: "Organisations",
  project: "Projects",
  booking: "Bookings",
  document: "Documents",
  task: "Tasks",
  message: "Messages",
  event: "Events",
};

export const entityKindDestinationLabel: Record<DemoEntityKind, string> = {
  person: "View on System Map",
  organisation: "View on System Map",
  project: "View in Tasks",
  booking: "View in Operations",
  document: "View in Documents",
  task: "View in Tasks",
  message: "View in Communications",
  event: "View in Calendar",
};
