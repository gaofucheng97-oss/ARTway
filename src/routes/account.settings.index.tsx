import { createFileRoute, Link } from "@tanstack/react-router";
import { Languages, ShieldCheck, Bell, ChevronRight } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";

export const Route = createFileRoute("/account/settings/")({
  component: Settings,
});

function Settings() {
  const links = [
    { to: "/account/settings/language", label: "Language", desc: "English, Simplified Chinese", icon: Languages },
    { to: "/account/settings/privacy", label: "Privacy", desc: "Contributions, data, consent", icon: ShieldCheck },
    { to: "/account/settings/notifications", label: "Notifications", desc: "Off by default", icon: Bell },
  ] as const;
  return (
    <MobileShell>
      <AppHeader title="Settings" subtitle="Account" back />
      <div className="space-y-2.5 px-4 py-5">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold">{l.label}</p>
                <p className="truncate text-xs text-muted-foreground">{l.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </MobileShell>
  );
}
