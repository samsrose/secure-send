import { Redis } from "@upstash/redis";

import { getShareTtlSeconds } from "@/lib/share-ttl";
import type { ShareRecord } from "@/lib/types";

const SHARE_PREFIX = "share:";

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis is not configured.");
  }

  return new Redis({ url, token });
}

export async function saveShareRedis(
  id: string,
  record: ShareRecord,
): Promise<void> {
  const ttlSeconds = getShareTtlSeconds();
  const redis = getRedis();
  await redis.set(`${SHARE_PREFIX}${id}`, record, { ex: ttlSeconds });
}

export async function getShareRedis(id: string): Promise<ShareRecord | null> {
  const redis = getRedis();
  const record = await redis.get<ShareRecord>(`${SHARE_PREFIX}${id}`);
  return record ?? null;
}
