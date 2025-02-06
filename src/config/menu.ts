import {
  BookKey,
  BookUser,
  Calendar,
  CalendarOff,
  CircleHelp,
  CircleUser,
  LayoutDashboard,
  Package,
  Settings,
  SquareLibrary,
  UsersIcon,
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
    icon: UsersIcon,
    access: ["admin", "moderator"],
  },
  {
    name: "Tools",
    path: "/tools",
    icon: Package,
    access: ["admin", "moderator"],
  },
  {
    name: "Courses",
    path: "/courses",
    icon: BookKey,
    access: ["admin", "moderator"],
  },
  {
    name: "Assets",
    path: "/assets",
    icon: SquareLibrary,
    access: ["admin", "moderator"],
  },
  {
    name: "Leaves",
    path: "/leaves",
    icon: CalendarOff,
    access: ["admin", "moderator"],
  },
  {
    name: "Leave Requests",
    path: "/leave-requests",
    icon: CircleHelp,
    access: ["admin", "moderator"],
  },
  {
    name: "My Profile",
    path: "/my-profile",
    icon: CircleUser,
    access: ["user"],
  },
  {
    name: "My Leaves",
    path: "/my-leaves",
    icon: CalendarOff,
    access: ["user"],
  },
  {
    name: "My Leave Requests",
    path: "/my-leave-requests",
    icon: CircleHelp,
    access: ["user"],
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: Calendar,
    access: ["admin", "moderator", "user"],
  },
  {
    name: "My Info",
    icon: BookUser,
    access: ["admin", "moderator"],
    children: [
      {
        name: "My Profile",
        path: "/my-profile",
        icon: CircleUser,
        access: ["admin", "moderator"],
      },
      {
        name: "My Leaves",
        path: "/my-leaves",
        icon: CalendarOff,
        access: ["admin", "moderator"],
      },
      {
        name: "My Requests",
        path: "/my-leave-requests",
        icon: CircleHelp,
        access: ["admin", "moderator"],
      },
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    access: ["admin"],
  },
];
