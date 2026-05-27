export type ShareStorageMode = "redis" | "localStorage";

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface ShareRecord extends EncryptedPayload {
  createdAt: string;
  expiresAt: string;
}

export interface CreateShareResponse {
  id: string;
  url: string;
  expiresAt: string;
}
