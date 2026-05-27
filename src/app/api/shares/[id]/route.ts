import { NextResponse } from "next/server";

import { getShare } from "@/lib/redis";
import { getShareStorageMode } from "@/lib/storage-mode";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const SHARE_ID_PATTERN = /^[0-9A-Za-z]{12}$/;

export async function GET(_request: Request, context: RouteContext) {
  if (getShareStorageMode() === "localStorage") {
    return NextResponse.json(
      {
        error:
          "Server storage is disabled locally. Load shares from this browser's localStorage.",
        mode: "localStorage",
      },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  if (!SHARE_ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }

  const record = await getShare(id);

  if (!record) {
    return NextResponse.json({ error: "Share not found or expired." }, { status: 404 });
  }

  return NextResponse.json({
    ciphertext: record.ciphertext,
    iv: record.iv,
    salt: record.salt,
    expiresAt: record.expiresAt,
  });
}
