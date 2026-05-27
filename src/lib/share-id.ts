import { customAlphabet } from "nanoid";

const createShareId = customAlphabet(
  "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  12,
);

export function newShareId(): string {
  return createShareId();
}
