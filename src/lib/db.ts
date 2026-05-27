import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!url) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not configured.");
  }

  return url;
}

export function getSql() {
  return neon(getDatabaseUrl());
}
