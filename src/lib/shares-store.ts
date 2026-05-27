import { saveSharePostgres, getSharePostgres } from "@/lib/postgres-shares";
import { getShareRedis, saveShareRedis } from "@/lib/redis-shares";
import { getShareStorageMode } from "@/lib/storage-mode";
import type { ShareRecord } from "@/lib/types";

export { getShareTtlSeconds } from "@/lib/share-ttl";

export async function saveShare(id: string, record: ShareRecord): Promise<void> {
  const mode = getShareStorageMode();

  if (mode === "postgres") {
    await saveSharePostgres(id, record);
    return;
  }

  if (mode === "redis") {
    await saveShareRedis(id, record);
    return;
  }

  throw new Error("Server storage is not configured.");
}

export async function getShare(id: string): Promise<ShareRecord | null> {
  const mode = getShareStorageMode();

  if (mode === "postgres") {
    return getSharePostgres(id);
  }

  if (mode === "redis") {
    return getShareRedis(id);
  }

  throw new Error("Server storage is not configured.");
}
