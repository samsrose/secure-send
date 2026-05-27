"use client";

import {
  getLocalShare,
  purgeExpiredLocalShares,
  saveLocalShare,
} from "@/lib/local-share-store";
import { newShareId } from "@/lib/share-id";
import type {
  CreateShareResponse,
  EncryptedPayload,
  ShareRecord,
  ShareStorageMode,
} from "@/lib/types";

const DEFAULT_TTL_SECONDS = 604_800;

let cachedStorageMode: ShareStorageMode | null = null;

export async function getShareStorageMode(): Promise<ShareStorageMode> {
  if (cachedStorageMode) {
    return cachedStorageMode;
  }

  const response = await fetch("/api/shares/storage", { cache: "no-store" });
  const data = (await response.json()) as { mode: ShareStorageMode };

  cachedStorageMode = data.mode;
  return data.mode;
}

function getClientTtlSeconds(): number {
  const configured = Number(process.env.NEXT_PUBLIC_SHARE_TTL_SECONDS ?? DEFAULT_TTL_SECONDS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_TTL_SECONDS;
  }
  return Math.floor(configured);
}

function buildShareRecord(payload: EncryptedPayload, ttlSeconds: number): ShareRecord {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlSeconds * 1000);

  return {
    ...payload,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

function getShareUrl(id: string): string {
  return `${window.location.origin}/s/${id}`;
}

export async function createShare(
  payload: EncryptedPayload,
): Promise<CreateShareResponse & { storage: ShareStorageMode }> {
  const mode = await getShareStorageMode();

  if (mode === "localStorage") {
    purgeExpiredLocalShares();
    const id = newShareId();
    const record = buildShareRecord(payload, getClientTtlSeconds());
    saveLocalShare(id, record);

    return {
      id,
      url: getShareUrl(id),
      expiresAt: record.expiresAt,
      storage: "localStorage",
    };
  }

  const response = await fetch("/api/shares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CreateShareResponse & {
    error?: string;
    storage?: ShareStorageMode;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create share.");
  }

  return {
    id: data.id,
    url: data.url,
    expiresAt: data.expiresAt,
    storage: "redis",
  };
}

export async function fetchSharePayload(
  id: string,
): Promise<EncryptedPayload & { expiresAt: string }> {
  const mode = await getShareStorageMode();

  if (mode === "localStorage") {
    purgeExpiredLocalShares();
    const record = getLocalShare(id);

    if (!record) {
      throw new Error(
        "Share not found in this browser. Local shares only work in the browser where they were created.",
      );
    }

    return {
      ciphertext: record.ciphertext,
      iv: record.iv,
      salt: record.salt,
      expiresAt: record.expiresAt,
    };
  }

  const response = await fetch(`/api/shares/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error("Share not found or expired.");
  }

  return (await response.json()) as EncryptedPayload & { expiresAt: string };
}
