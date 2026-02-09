import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { getLocale, formatDate, formatDateShort, formatDateLong, formatDateCompact } from "./i18n"
