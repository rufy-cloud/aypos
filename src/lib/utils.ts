import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchTemperatureData(n?: number) {
  const url = n
    ? `http://141.196.166.241:8003/prom/get_chart_data/temperature/${n}`
    : `http://141.196.166.241:8003/prom/get_chart_data/temperature`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch temperature data');
  return response.json();
}
