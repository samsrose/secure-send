export type ShareStorageMode = "postgres" | "redis" | "localStorage";

export function hasPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL ?? process.env.POSTGRES_URL);
}

export function hasRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function getShareStorageMode(): ShareStorageMode {
  if (hasPostgresConfigured()) {
    return "postgres";
  }

  if (hasRedisConfigured()) {
    return "redis";
  }

  return "localStorage";
}
