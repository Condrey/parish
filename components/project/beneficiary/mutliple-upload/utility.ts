import { isValid, parse } from "date-fns";

const formats = ["dd.MM.yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];

export function parseFlexibleDate(value: string): Date {
  for (const format of formats) {
    const parsed = parse(value, format, new Date());
    if (isValid(parsed)) return parsed;
  }
  return new Date();
}
