import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYear() {
  return new Date().getFullYear();
}

export function getCompanyName() {
  return process.env.NEXT_PUBLIC_COMPANY_NAME || "Goalwave";
}
