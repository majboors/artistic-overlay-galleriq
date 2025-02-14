
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseImageData(datefield: string) {
  try {
    return JSON.parse(datefield) as {
      studentName: string;
      grade: string;
      title: string;
    };
  } catch (e) {
    return {
      studentName: "Unknown",
      grade: "Unknown",
      title: "Unknown"
    };
  }
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}
