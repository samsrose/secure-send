"use client";

import { KeyRound, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { decryptSecret } from "@/lib/crypto";
import { fetchSharePayload } from "@/lib/share-client";

interface DecryptShareFormProps {
  defaultShareId?: string;
}

export function DecryptShareForm({ defaultShareId = "" }: DecryptShareFormProps) {
  const [shareId, setShareId] = useState(defaultShareId);
  const [password, setPassword] = useState("");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  async function handleDecrypt() {
    const normalizedId = shareId.trim();

    if (!normalizedId) {
      toast.error("Enter the share ID from your link.");
      return;
    }

    if (!password) {
      toast.error("Enter the 8-character password.");
      return;
    }

    setIsDecrypting(true);
    setDecryptedText(null);

    try {
      const payload = await fetchSharePayload(normalizedId);
      const plaintext = await decryptSecret(payload, password);
      setDecryptedText(plaintext);
      setExpiresAt(payload.expiresAt ?? null);
      toast.success("Secret decrypted.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to decrypt secret.";
      toast.error(message);
    } finally {
      setIsDecrypting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100">
        <CardTitle>Decrypt a secret</CardTitle>
        <CardDescription>
          Open a share link or paste its ID, then enter the password that was
          generated when the secret was created.
        </CardDescription>
      </CardHeader>
      <CardContent className="page-load-fade space-y-5">
        <div className="space-y-2">
          <Label htmlFor="share-id">Share ID</Label>
          <Input
            id="share-id"
            placeholder="e.g. 7kX9mN2pQaRt"
            value={shareId}
            onChange={(event) => setShareId(event.target.value)}
            className="font-mono"
            disabled={isDecrypting}
          />
          <p className="text-muted-foreground text-sm">
            The ID is the last segment of your link: /s/<span className="font-mono">ID</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decrypt-password">Password</Label>
          <Input
            id="decrypt-password"
            type="password"
            autoComplete="off"
            placeholder="8-character password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={64}
            className="font-mono tracking-widest"
            disabled={isDecrypting}
          />
        </div>

        {decryptedText !== null ? (
          <div className="space-y-2">
            <Label htmlFor="decrypted-secret">Decrypted secret</Label>
            <Textarea
              id="decrypted-secret"
              value={decryptedText}
              readOnly
              rows={8}
              className="font-mono text-sm"
            />
            {expiresAt ? (
              <p className="text-muted-foreground text-sm">
                Share expires {new Date(expiresAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="page-load-fade">
        <Button onClick={handleDecrypt} disabled={isDecrypting}>
          {isDecrypting ? (
            "Decrypting..."
          ) : (
            <>
              <Unlock className="size-4" />
              Decrypt secret
            </>
          )}
        </Button>
        {!decryptedText ? (
          <p className="text-muted-foreground ml-auto flex items-center gap-1 text-sm">
            <KeyRound className="size-4" />
            Password required
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
