"use client";

import { Shield } from "lucide-react";
import Image from "next/image";
import { CreateShareForm } from "@/components/create-share-form";
import { DecryptShareForm } from "@/components/decrypt-share-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SecureShareShell() {
  return (
    <div className="page-load-fade mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 py-12">
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/art.png" alt="Secure Share" width={500} height={300} />
        </div>
      </header>

      <Separator />

      <Tabs defaultValue="share" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
        </TabsList>
        <TabsContent value="share" className="mt-6">
          <CreateShareForm />
        </TabsContent>
        <TabsContent value="decrypt" className="mt-6">
          <DecryptShareForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
