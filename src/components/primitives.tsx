import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Chip({
  active,
  children,
  onClick,
  icon,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

const tagStyles: Record<string, string> = {
  Audio: "bg-teal/25 text-navy",
  "Audio guide": "bg-teal/25 text-navy",
  AR: "bg-secondary/15 text-secondary",
  "Student favourite": "bg-orange/30 text-orange-foreground",
  "Hidden story": "bg-primary/15 text-primary",
  "Community story": "bg-primary/15 text-primary",
  "Public art": "bg-muted text-muted-foreground",
  Campus: "bg-muted text-muted-foreground",
};

export function Tag({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tagStyles[label] ?? "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-lg font-semibold text-foreground">
        {children}
      </h2>
      {action}
    </div>
  );
}

export function Pill({
  icon,
  children,
  tone = "muted",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "muted" | "teal" | "orange" | "primary";
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    teal: "bg-teal/25 text-navy",
    orange: "bg-orange/25 text-orange-foreground",
    primary: "bg-primary/12 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {icon}
      {children}
    </span>
  );
}
