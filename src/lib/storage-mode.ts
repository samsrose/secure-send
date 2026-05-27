export type ShareStorageMode = "redis" | "localStorage";

export function hasRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function getShareStorageMode(): ShareStorageMode {
  return hasRedisConfigured() ? "redis" : "localStorage";
}
