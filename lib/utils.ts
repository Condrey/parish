import { clsx, type ClassValue } from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const webName = `PDMIS `;
export const organization = "UGANDA GOVERNMENT";
export const siteConfig = {
  name: "Parish Development Management Information System",
  url: process.env.NEXT_PUBLIC_BASE_URL,
  short_name: webName,
  logo: "/logo.png",
  defaultCoverImage: "/web-app-manifest-512x512.png",
  description: `Parish Development Management Information System (PDMIS) is a web-based application designed to streamline and enhance the management of parish development activities in Uganda. It provides a centralized platform for local government officials, community leaders, and stakeholders to efficiently plan, monitor, and report on development projects at the parish level. PDMIS aims to improve transparency, accountability, and coordination in the implementation of development initiatives, ultimately contributing to the socio-economic growth of communities across Uganda.`,
};

export const getNameInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("");
  return initials.toUpperCase();
};

// should produce values like 1000 as 1k
export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercentage(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumSignificantDigits: 3,
    minimumSignificantDigits: 2,
    style: "percent",
  }).format(n);
}

export function formatCurrency(
  amount: number,
  currency?: string,
  shouldNotCompact?: boolean,
): string {
  return Intl.NumberFormat("en-US", {
    notation: shouldNotCompact ? "standard" : "compact",
    minimumSignificantDigits: 2,
    compactDisplay: "long",
    style: "currency",
    currency: currency || "Ugx",
  }).format(amount);
}

export function getColorsFromText(text: string) {
  // deterministic hex based on name length
  const len = Math.max(1, text.length);
  const hash = (len * 2654435761) >>> 0; // spread bits deterministically
  const color_one = (hash & 0xffffff).toString(16).padStart(6, "0");
  const color_two = (((hash >>> 8) | (hash << 24)) & 0xffffff)
    .toString(16)
    .padStart(6, "0");

  const color1 = `#${color_one}`;
  const color2 = `#${color_two}`;
  const linear_gradient = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;

  return { color1, color2, linear_gradient };
}

export function slugify(input: string | undefined): string {
  return input
    ? input
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing whitespace
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "") // Replace spaces with hyphens
        .replace(/-+/g, "") // Remove multiple consecutive hyphens
    : "";
}

export const calculateDuration = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date | null | undefined;
}) =>
  formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate ?? new Date(),
    }),
  );

export const formatPersonName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ") // normalize spaces
    .split(" ")
    .map((word) =>
      word
        .split(/[-']/) // split on hyphen or apostrophe
        .filter(Boolean)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .reduce((acc, part, i) => {
          const separator = word.match(/[-']/g)?.[i - 1];
          return i === 0 ? part : acc + separator + part;
        }, ""),
    )
    .join(" ");

export function sanitizeFilename(name: string): string {
  return name.replace(/[\/\\:*?"<>|]/g, "-");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Date time
export const getTimeInput = (dateValue: Date) =>
  dateValue.getHours() +
  ":" +
  dateValue.getMinutes() +
  ":" +
  dateValue.getSeconds();

export const getDateTimeOutput = (
  time: string,
  date: Date | null | undefined,
) => {
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
  const newDate = date ? new Date(date) : new Date();
  newDate.setHours(Number(hours), Number(minutes), Number(seconds));
  newDate.setDate(Number(date?.getDate()));
  newDate.setMonth(Number(date?.getMonth()));
  newDate.setFullYear(Number(date?.getFullYear()));
  return newDate;
};
