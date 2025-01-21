import {
  BookKey,
  Calendar,
  CalendarOff,
  CircleHelp,
  CircleUser,
  LayoutDashboard,
  Package,
  SquareLibrary,
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
    name: "My Info",
    path: "/my-info",
    icon: CircleUser,
    access: ["user"],
  },
  {
    name: "Tools",
    path: "/tools",
    icon: BookKey,
    access: ["admin", "moderator"],
  },
  {
    name: "Courses",
    icon: SquareLibrary,
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
