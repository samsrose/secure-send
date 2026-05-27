import { NextResponse } from "next/server";

import { getShareStorageMode } from "@/lib/storage-mode";
import { getShareTtlSeconds } from "@/lib/share-ttl";

export async function GET() {
  return NextResponse.json({
    mode: getShareStorageMode(),
    ttlSeconds: getShareTtlSeconds(),
  });
}
