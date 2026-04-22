import {
  LucideIcon,
  SendToBackIcon,
  ShapesIcon,
  TreePalmIcon,
  UploadIcon,
} from "lucide-react";
import { Role } from "./generated/prisma/enums";

export const MAX_ATTACHMENTS = 5;
export const REDIRECT_TO_URL_SEARCH_PARAMS = "redirectToUrl";
export const APPLICATION_TYPE_SEARCH_PARAMETER = "application-type";
export const DEFAULT_PASSWORD = "defaultPassword123!";
export const MOBILE_MAX_ITEMS = 10;

export type NavLink = { title: string; href: string; description: string };
export type NavLinkGroup = {
  title: string;
  href: string;
  showOnMediumScreen: boolean;
  description: string;
  children: NavLink[];
  icon?: LucideIcon;
};

export const districtsNavLinkGroup: NavLinkGroup = {
  title: "Districts/ cities",
  href: "/district",
  description:
    "All districts and cities in the country that are registered in the system.",
  icon: TreePalmIcon,
  children: [],
  showOnMediumScreen: true,
};

export const browsesNavLinkGroup: NavLinkGroup = {
  title: "Browse",
  href: "/",
  description:
    "View all the different sub-counties, parishes, villages, and SACCO groups in the system.",
  icon: ShapesIcon,
  children: [
    {
      title: "Sub-counties",
      href: "/sub-counties",
      description:
        "All sub-counties in the country that are registered in the system.",
    },
    {
      title: "parishes",
      href: "/parishes",
      description:
        "All parishes in the country that are registered in the system.",
    },
    {
      title: "villages",
      href: "/villages",
      description:
        "All villages in the country that are registered in the system.",
    },
    {
      title: "SACCO groups",
      href: "/sacco-groups",
      description:
        "All SACCO groups in the country that are registered in the system.",
    },
    {
      title: "Beneficiaries",
      href: "/beneficiaries",
      description:
        "All beneficiaries in the country that are registered in the system.",
    },
  ],
  showOnMediumScreen: true,
};
export const reStockingNavLinkGroup: NavLinkGroup = {
  title: "Restocking",
  href: "/restocking",
  description: "View all the different information regarding re-stocking.",
  icon: SendToBackIcon,
  children: [
    {
      title: "Selection",
      href: "/restocking/selection",
      description: "Use this to select the eligible beneficiaries",
    },
    {
      title: "extraction",
      href: "/restocking/extraction",
      description: "Extract the beneficiaries for disbursement.",
    },
  ],
  showOnMediumScreen: true,
};
export const uploadingNavLinkGroup: NavLinkGroup = {
  title: "Upload",
  href: "/upload",
  description: "Upload beneficiaries to the system",
  icon: UploadIcon,
  children: [
    {
      title: "Beneficiaries",
      href: "upload/beneficiaries",
      description: "UBulk upload of beneficiaries into the system",
    },
  ],
  showOnMediumScreen: true,
};
export const allNavLinks: NavLinkGroup[] = [
  districtsNavLinkGroup,
  browsesNavLinkGroup,
  reStockingNavLinkGroup,
  uploadingNavLinkGroup,
];

export const privilegeLinks: Record<Role, { navLinks: NavLinkGroup[] }> = {
  ADMIN: { navLinks: allNavLinks },
  TECHNICAL_OFFICER: { navLinks: allNavLinks },
  RETURNING_OFFICER: { navLinks: allNavLinks },
  TOWN_AGENT: {
    navLinks: allNavLinks,
  },
};
