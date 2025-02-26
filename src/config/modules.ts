import {
  Award,
  BookKey,
  Calendar,
  CalendarOff,
  Contact,
  Files,
  GraduationCap,
  HandCoins,
  Landmark,
  Package,
  SquareLibrary,
  UserCheck,
} from "lucide-react";

export const modules = [
  {
    name: "Payroll",
    identifier: "payroll",
    description: "Manage payroll",
    icon: HandCoins,
  },
  {
    name: "Leave",
    identifier: "leave",
    description: "Manage leaves",
    icon: CalendarOff,
  },
  {
    name: "Calendar",
    identifier: "calendar",
    description: "Manage calendar",
    icon: Calendar,
  },
  {
    name: "Tool",
    identifier: "tool",
    description: "Manage tools",
    icon: Package,
  },
  {
    name: "Course",
    identifier: "course",
    description: "Manage courses",
    icon: BookKey,
  },
  {
    name: "Asset",
    identifier: "asset",
    description: "Manage assets",
    icon: SquareLibrary,
  },
  {
    name: "Employee Bank",
    identifier: "employee-bank",
    description: "Manage employee bank",
    icon: Landmark,
  },
  {
    name: "Employee Contact",
    identifier: "employee-contact",
    description: "Manage employee contact",
    icon: Contact,
  },
  {
    name: "Employee Document",
    identifier: "employee-document",
    description: "Manage employee document",
    icon: Files,
  },
  {
    name: "Employee Lifecycle",
    identifier: "employee-lifecycle",
    description: "Manage employee lifecycle tasks",
    icon: UserCheck,
  },
  {
    name: "Employee Education",
    identifier: "employee-education",
    description: "Manage employee education",
    icon: GraduationCap,
  },
  {
    name: "Employee Achievement",
    identifier: "employee-achievement",
    description: "Manage employee achievement",
    icon: Award,
  },
];
