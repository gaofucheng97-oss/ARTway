import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Box, Headphones, MessageSquare, PenLine } from "lucide-react";
import { MobileShell, AppHeader } from "@/components/MobileShell";
import { getArtwork } from "@/data/content";

export const Route = createFileRoute("/artwork/$id/scan")({
  loader: ({ params }) => {
    const artwork = getArtwork(params.id);
    if (!artwork) throw notFound();
    return { artwork };
  },
  component: ScanScreen,
  notFoundComponent: () => (
    <MobileShell>
      <AppHeader title="On-site Experience" back />
      <div className="p-6 text-center text-sm text-muted-foreground">Artwork not found.</div>
    </MobileShell>
  ),
});

function ScanScreen() {
  const { artwork } = Route.useLoaderData();

  const expect = [
    { icon: Box, label: "AR storytelling" },
    { icon: Headphones, label: "Audio guide" },
    { icon: MessageSquare, label: "Interactive prompts" },
    { icon: PenLine, label: "Share your reflection" },
  ];

  return (
    <MobileShell>
      <AppHeader title="On-site Experience" back />

      <div className="px-4 pb-6 pt-4">
        {/* Scanner card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/50 px-6 py-10">
          <div className="relative h-32 w-32">
            {/* corner brackets */}
            <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-foreground" />
            <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-foreground" />
            <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-foreground" />
            <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-foreground" />
          </div>
          <p className="mt-6 text-center text-sm text-foreground">
            Scan the QR code<br />at the artwork site
          </p>
          <Link
            to="/artwork/$id/ar"
            params={{ id: artwork.id }}
            className="mt-6 w-full rounded-2xl bg-foreground py-3.5 text-center text-sm font-semibold text-background"
          >
            Start Experience
          </Link>
        </div>

        {/* What to expect */}
        <h3 className="mt-6 text-sm font-semibold">What to expect</h3>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {expect.map((e) => {
            const Icon = e.icon;
            return (
              <div key={e.label} className="flex items-center gap-3 px-4 py-3.5">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                <span className="text-sm">{e.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
