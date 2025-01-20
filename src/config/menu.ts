import {
  Book,
  Calendar,
  CalendarOff,
  CircleHelp,
  LayoutDashboard,
  Package,
  Settings2,
  Users,
} from "lucide-react";

export const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    access: ["admin", "moderator", "user"],
  },
  {
    name: "Employees",
    path: "/employees",
    icon: Users,
    access: ["admin", "moderator"],
  },
  {
    name: "Tools",
    path: "/tools",
    icon: Settings2,
    access: ["admin", "moderator"],
  },
  {
    name: "Courses",
    icon: Book,
    access: ["admin", "moderator"],
    path: "/courses",
  },
  {
    name: "Assets",
    icon: Package,
    access: ["admin", "moderator"],
    path: "/assets",
  },
  {
    name: "Leaves",
    icon: CalendarOff,
    access: ["admin", "moderator", "user"],
    path: "/leaves",
  },
  {
    name: "Requests",
    icon: CircleHelp,
    access: ["admin", "moderator", "user"],
    path: "/requests",
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: Calendar,
    access: ["admin", "moderator", "user"],
  },
];
