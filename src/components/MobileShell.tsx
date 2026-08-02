import { Link, useCanGoBack, useRouter, useRouterState } from "@tanstack/react-router";
import { Map, Users, User, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Guide", icon: Map, match: (p: string) => !p.startsWith("/community") && !p.startsWith("/account") },
  { to: "/community", label: "Community", icon: Users, match: (p: string) => p.startsWith("/community") },
  { to: "/account", label: "Account", icon: User, match: (p: string) => p.startsWith("/account") },
];

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-card">
      <div className="grid w-full grid-cols-3">

        {tabs.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[11px]",
                active ? "text-foreground font-semibold" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.6} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppHeader({
  title,
  back,
  right,
  subtitle: _subtitle,
  transparent: _transparent,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
      {back ? (
        <button
          type="button"
          onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/" }))}
          aria-label="Go back"
          className="grid h-8 w-8 shrink-0 place-items-center text-foreground"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
        </button>
      ) : (
        <div className="h-8 w-8 shrink-0" />
      )}
      <h1 className="flex-1 text-center text-base font-semibold text-foreground">{title}</h1>
      <div className="h-8 w-8 shrink-0 flex items-center justify-end">{right}</div>
    </header>
  );
}

export function MobileShell({
  children,
  hideNav,
  className,
}: {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-muted/40">
      <div className="relative flex h-dvh w-full max-w-[393px] flex-col bg-background sm:my-4 sm:h-[852px] sm:w-[393px] sm:rounded-[2.5rem] sm:border sm:border-border sm:overflow-hidden sm:shadow-sm">
        <div className={cn("flex flex-1 flex-col overflow-y-auto no-scrollbar", className)}>
          {children}
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>

  );
}
