export type TEmployeeRole = "user" | "moderator" | "admin" | "former";

export type TEmployee = {
  id: string;
  name: string;
  role: TEmployeeRole;
  department?: string;
  designation?: string;
};
