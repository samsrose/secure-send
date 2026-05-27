import { NextResponse } from "next/server";

import { getAppBaseUrl } from "@/lib/app-url";
import { saveShare } from "@/lib/redis";
import { newShareId } from "@/lib/share-id";
import { getShareTtlSeconds } from "@/lib/share-ttl";
import { getShareStorageMode } from "@/lib/storage-mode";
import type { EncryptedPayload, ShareRecord } from "@/lib/types";

const MAX_CIPHERTEXT_LENGTH = 512_000;

function isValidPayload(payload: unknown): payload is EncryptedPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as EncryptedPayload;
  return (
    typeof candidate.ciphertext === "string" &&
    typeof candidate.iv === "string" &&
    typeof candidate.salt === "string" &&
    candidate.ciphertext.length > 0 &&
    candidate.ciphertext.length <= MAX_CIPHERTEXT_LENGTH &&
    candidate.iv.length > 0 &&
    candidate.salt.length > 0
  );
}

export async function POST(request: Request) {
  if (getShareStorageMode() === "localStorage") {
    return NextResponse.json(
      {
        error:
          "Server storage is disabled locally. Shares are saved in this browser's localStorage.",
        mode: "localStorage",
      },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Encrypted payload is required." },
      { status: 400 },
    );
  }

  const id = newShareId();
  const ttlSeconds = getShareTtlSeconds();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlSeconds * 1000);

  const record: ShareRecord = {
    ...body,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await saveShare(id, record);

  const baseUrl = getAppBaseUrl(request);

  return NextResponse.json({
    id,
    url: `${baseUrl}/s/${id}`,
    expiresAt: record.expiresAt,
    storage: "redis",
  });
}
