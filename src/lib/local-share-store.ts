"use client";

import type { ShareRecord } from "@/lib/types";

const STORAGE_PREFIX = "secure-share:share:";

function storageKey(id: string): string {
  return `${STORAGE_PREFIX}${id}`;
}

function isExpired(record: ShareRecord): boolean {
  return new Date(record.expiresAt).getTime() <= Date.now();
}

export function saveLocalShare(id: string, record: ShareRecord): void {
  localStorage.setItem(storageKey(id), JSON.stringify(record));
}

export function getLocalShare(id: string): ShareRecord | null {
  const raw = localStorage.getItem(storageKey(id));

  if (!raw) {
    return null;
  }

  try {
    const record = JSON.parse(raw) as ShareRecord;

    if (isExpired(record)) {
      localStorage.removeItem(storageKey(id));
      return null;
    }

    return record;
  } catch {
    localStorage.removeItem(storageKey(id));
    return null;
  }
}

export function purgeExpiredLocalShares(): void {
  const keysToRemove: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (!key?.startsWith(STORAGE_PREFIX)) {
      continue;
    }

    const raw = localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      const record = JSON.parse(raw) as ShareRecord;

      if (isExpired(record)) {
        keysToRemove.push(key);
      }
    } catch {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}
