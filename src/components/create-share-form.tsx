"use client";

import { Copy, Link2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { encryptSecret } from "@/lib/crypto";
import { generatePassword } from "@/lib/password";
import { createShare } from "@/lib/share-client";

export function CreateShareForm() {
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshPassword = useCallback(() => {
    setPassword(generatePassword(8));
  }, []);

  useEffect(() => {
    refreshPassword();
  }, [refreshPassword]);

  async function handleCreateShare() {
    if (!secret.trim()) {
      toast.error("Enter the secret text you want to share.");
      return;
    }

    setIsSubmitting(true);

    try {
      const encrypted = await encryptSecret(secret.trim(), password);
      const data = await createShare(encrypted);

      setShareUrl(data.url);
      setExpiresAt(data.expiresAt);

      if (data.storage === "localStorage") {
        toast.message(
          "Saved to this browser's localStorage (local dev). Open the link in the same browser.",
        );
      }

      toast.success("Secure link created.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create share.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied.`);
  }

  function handleReset() {
    setSecret("");
    setShareUrl(null);
    setExpiresAt(null);
    refreshPassword();
  }

  return (
    <Card>
      <CardHeader className="animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100">
        <CardTitle>Share a secret</CardTitle>
        <CardDescription>
          Your text is encrypted in the browser before it is stored. Only someone
          with the password can decrypt it.
        </CardDescription>
      </CardHeader>
      <CardContent className="page-load-fade space-y-5">
        <div className="space-y-2">
          <Label htmlFor="secret">Secret text</Label>
          <Textarea
            id="secret"
            placeholder="Paste passwords, API keys, or private notes..."
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            rows={8}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password">Generated password (8 characters)</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={refreshPassword}
              disabled={isSubmitting}
            >
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              id="password"
              value={password}
              readOnly
              className="font-mono tracking-widest"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => copyValue(password, "Password")}
              disabled={!password}
            >
              <Copy className="size-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Send the password separately from the link. It is never stored on the
            server.
          </p>
        </div>

        {shareUrl ? (
          <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
            <Label htmlFor="share-url">Share link</Label>
            <div className="flex gap-2">
              <Input id="share-url" value={shareUrl} readOnly className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                onClick={() => copyValue(shareUrl, "Share link")}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            {expiresAt ? (
              <p className="text-muted-foreground text-sm">
                Expires {new Date(expiresAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="page-load-fade flex flex-wrap gap-2">
        <Button onClick={handleCreateShare} disabled={isSubmitting}>
          <Link2 className="size-4" />
          {isSubmitting ? "Creating..." : "Generate secure link"}
        </Button>
        {shareUrl ? (
          <Button type="button" variant="secondary" onClick={handleReset}>
            Create another
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
