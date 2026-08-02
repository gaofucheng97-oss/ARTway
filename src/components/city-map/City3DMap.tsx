import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { MapPoint } from "@/data/map-points";

const CityScene = lazy(() => import("./CityScene"));

export function City3DMap(props: {
  points: MapPoint[];
  activeId?: string | null;
  onHover: (id: string | null) => void;
  onSelect: (p: MapPoint) => void;
  resetKey: number;
}) {
  return (
    <div className="absolute inset-0" style={{ background: "#ffffff" }}>
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <CityScene {...props} />
        </Suspense>
      </ClientOnly>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 56%, rgba(255,255,255,0.3) 72%, rgba(255,255,255,0.82) 88%, #ffffff 100%)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage:
            "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 54%, rgba(0,0,0,0.32) 70%, #000 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 88% 78% at 50% 50%, transparent 54%, rgba(0,0,0,0.32) 70%, #000 100%)",
        }}
      />
    </div>
  );
}
