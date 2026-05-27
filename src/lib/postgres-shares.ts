import { getSql } from "@/lib/db";
import type { ShareRecord } from "@/lib/types";

interface ShareRow {
  id: string;
  ciphertext: string;
  iv: string;
  salt: string;
  created_at: Date | string;
  expires_at: Date | string;
}

function rowToRecord(row: ShareRow): ShareRecord {
  return {
    ciphertext: row.ciphertext,
    iv: row.iv,
    salt: row.salt,
    createdAt: new Date(row.created_at).toISOString(),
    expiresAt: new Date(row.expires_at).toISOString(),
  };
}

export async function saveSharePostgres(
  id: string,
  record: ShareRecord,
): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO shares (id, ciphertext, iv, salt, created_at, expires_at)
    VALUES (
      ${id},
      ${record.ciphertext},
      ${record.iv},
      ${record.salt},
      ${record.createdAt},
      ${record.expiresAt}
    )
  `;
}

export async function getSharePostgres(id: string): Promise<ShareRecord | null> {
  const sql = getSql();

  const rows = (await sql`
    SELECT id, ciphertext, iv, salt, created_at, expires_at
    FROM shares
    WHERE id = ${id}
      AND expires_at > NOW()
    LIMIT 1
  `) as ShareRow[];

  const row = rows[0];

  if (!row) {
    await sql`
      DELETE FROM shares
      WHERE id = ${id}
        AND expires_at <= NOW()
    `;
    return null;
  }

  return rowToRecord(row);
}
