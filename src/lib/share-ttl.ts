export function getShareTtlSeconds(): number {
  const configured = Number(process.env.SHARE_TTL_SECONDS ?? "604800");

  if (!Number.isFinite(configured) || configured <= 0) {
    return 604_800;
  }

  return Math.floor(configured);
}
