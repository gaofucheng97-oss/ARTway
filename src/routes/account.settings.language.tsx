import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/settings/language")({
  component: Language,
});

const langs = [
  { id: "en", label: "English", available: true },
  { id: "zh", label: "Simplified Chinese · 简体中文", available: true },
  { id: "more", label: "More languages coming soon", available: false },
];

function Language() {
  const [sel, setSel] = useState("en");
  return (
    <MobileShell>
      <AppHeader title="Language" subtitle="Settings" back />
      <div className="space-y-2.5 px-4 py-5">
        {langs.map((l) => (
          <button
            key={l.id}
            disabled={!l.available}
            onClick={() => setSel(l.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold",
              sel === l.id ? "border-primary bg-primary/12 text-primary" : "border-border bg-card",
              !l.available && "opacity-50",
            )}
          >
            {l.label}
            {sel === l.id && <Check className="h-5 w-5" />}
          </button>
        ))}
      </div>
    </MobileShell>
  );
}
