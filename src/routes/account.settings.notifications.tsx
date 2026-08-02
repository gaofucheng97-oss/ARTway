import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/settings/notifications")({
  component: Notifications,
});

const items = [
  "Nearby artwork reminders",
  "Saved route reminders",
  "New stories added to saved artworks",
  "Community replies",
  "Event notifications",
];

function Notifications() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return (
    <MobileShell>
      <AppHeader title="Notifications" subtitle="Settings" back />
      <div className="px-4 py-5">
        <p className="mb-4 text-sm text-muted-foreground">Notifications are optional and off by default.</p>
        <div className="space-y-2.5">
          {items.map((label) => {
            const enabled = !!on[label];
            return (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <span className="pr-3 text-sm font-medium">{label}</span>
                <button
                  role="switch"
                  aria-checked={enabled}
                  aria-label={label}
                  onClick={() => setOn((s) => ({ ...s, [label]: !enabled }))}
                  className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", enabled ? "bg-primary" : "bg-muted")}
                >
                  <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all", enabled ? "left-6" : "left-1")} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
