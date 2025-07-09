import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Migration API functions

export async function fetchMigrationAdvice() {
  const response = await fetch("http://141.196.166.241:8003/migration/advice");
  if (!response.ok) throw new Error('Failed to fetch migration advice');
  return response.json();
}

export async function fetchGainBefore() {
  const response = await fetch("http://141.196.166.241:8003/migration/gain-before");
  if (!response.ok) throw new Error('Failed to fetch gain before');
  return response.json();
}

export async function fetchGainAfter() {
  const response = await fetch("http://141.196.166.241:8003/migration/gain-after");
  if (!response.ok) throw new Error('Failed to fetch gain after');
  return response.json();
}

export async function approveMigration() {
  const response = await fetch("http://141.196.166.241:8003/migration/approve", {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to approve migration');
  return response.json();
}

export async function declineMigration() {
  const response = await fetch("http://141.196.166.241:8003/migration/decline", {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to decline migration');
  return response.json();
}