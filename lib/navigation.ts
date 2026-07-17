import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessagesSquare,
  Radar,
  Search,
  Waypoints,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
};

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Mission Control",
    description:
      "A prioritised view of what needs attention, once real sources are connected.",
    icon: LayoutDashboard,
  },
  {
    href: "/search",
    label: "Search",
    description:
      "Search across people, projects, operations, communications and knowledge.",
    icon: Search,
  },
  {
    href: "/system-map",
    label: "System Map",
    description:
      "The connected graph of people, organisations, projects and operations.",
    icon: Waypoints,
  },
  {
    href: "/operations",
    label: "Operations",
    description:
      "Daily activity, bookings and operational status from Adventure Hub and connected systems.",
    icon: Radar,
  },
  {
    href: "/projects",
    label: "Projects",
    description:
      "Active projects, owners, next actions and the work moving across every brand.",
    icon: FolderKanban,
  },
  {
    href: "/tasks",
    label: "Tasks",
    description:
      "Tasks assigned across the team, connected to the projects they serve.",
    icon: CheckSquare,
  },
  {
    href: "/knowledge",
    label: "Knowledge",
    description:
      "Maintained documentation, procedures and decisions from Docmost, Drive and GitHub.",
    icon: BookOpen,
  },
  {
    href: "/documents",
    label: "Documents",
    description:
      "Files and signed agreements connected to the work they relate to.",
    icon: FileText,
  },
  {
    href: "/communications",
    label: "Communications",
    description:
      "Email, chat and messages connected to the people, projects and work they relate to.",
    icon: MessagesSquare,
  },
  {
    href: "/calendar",
    label: "Calendar",
    description:
      "Tours, meetings and deadlines connected to the work they relate to.",
    icon: CalendarDays,
  },
];
