import { Gender, Role, Status } from "./generated/prisma/enums";

// role
const allRoles = Object.values(Role);
export const myPrivileges: Record<Role, Role[]> = {
  ADMIN: allRoles,
  RETURNING_OFFICER: allRoles,
  TECHNICAL_OFFICER: [Role.TECHNICAL_OFFICER, Role.TOWN_AGENT],
  TOWN_AGENT: [Role.TOWN_AGENT],
};

export const userRoles: Record<Role, { role: string }> = {
  ADMIN: {
    role: "Administrator",
  },
  TOWN_AGENT: {
    role: "Town Agent",
  },
  TECHNICAL_OFFICER: {
    role: "Technical Officer",
  },
  RETURNING_OFFICER: {
    role: "Returning Officer",
  },
};

// Gender
export const allGenders = Object.values(Gender);
export const genders: Record<Gender, { title: string }> = {
  MALE: {
    title: "Male",
  },
  FEMALE: {
    title: "Female",
  },
};

// Statuses
export const allStatuses = Object.values(Status);
export const statuses: Record<Status, { title: string }> = {
  ACTIVE: {
    title: "Active",
  },
  INACTIVE: {
    title: "Inactive",
  },
};
