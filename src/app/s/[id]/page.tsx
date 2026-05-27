import Link from "next/link";
import { Shield } from "lucide-react";

import { DecryptShareForm } from "@/components/decrypt-share-form";
interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  return (
    <div className="page-load-fade mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Shield className="size-8" />
          <h1 className="text-3xl font-semibold tracking-tight">Decrypt secret</h1>
        </div>
        <p className="text-muted-foreground">
          Enter the password that was shared with you to reveal this secret.
        </p>
        <Link
          href="/"
          className="text-primary inline-flex h-8 items-center justify-center px-2 text-sm underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </header>

      <DecryptShareForm defaultShareId={id} />
    </div>
  );
}
