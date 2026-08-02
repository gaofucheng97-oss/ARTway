import { artworks } from "./content";
import workshopAsset from "@/assets/charting-change-workshop.png.asset.json";

export interface MapPoint {
  id: string;
  title: string;
  location: string;
  description: string;
  tags: string[];
  thumb?: string;
  /** map position in % of the map surface */
  pin: { x: number; y: number };
  /** id of a full artwork room, when one exists */
  artworkId?: string;
  featured?: boolean;
}

/** The six artworks that have full digital rooms */
const artworkPoints: MapPoint[] = artworks.map((a) => ({
  id: a.id,
  title: a.title,
  location: a.location,
  description: a.description,
  tags: [
    ...(a.hasAudio ? ["Audio"] : []),
    ...(a.hasAR ? ["AR"] : []),
    "Community",
    "Route stop",
  ],
  thumb: a.image,
  pin: a.pin,
  artworkId: a.id,
}));

/** Extra public art in the wider Bristol network (map-only previews) */
const extraPoints: MapPoint[] = [
  {
    id: "harbour-mural",
    title: "Harbour Voices",
    location: "Wapping Wharf",
    description: "A painted wall of dockworker portraits gathered from harbourside oral histories.",
    tags: ["Community", "Route stop"],
    pin: { x: 22, y: 62 },
  },
  {
    id: "stokes-croft-wall",
    title: "Croft Colour Wall",
    location: "Stokes Croft",
    description: "A rotating street-art wall repainted every season by local emerging artists.",
    tags: ["Community"],
    pin: { x: 34, y: 22 },
  },
  {
    id: "bridge-lights",
    title: "Bridge Signals",
    location: "Castle Bridge",
    description: "Light sculpture that pulses with the rhythm of the river and passing footsteps.",
    tags: ["Audio", "Route stop"],
    pin: { x: 62, y: 30 },
  },
  {
    id: "green-benches",
    title: "Listening Benches",
    location: "Castle Park",
    description: "Carved benches that play recorded memories of the park when you sit down.",
    tags: ["Audio", "Community"],
    pin: { x: 46, y: 18 },
  },
  {
    id: "market-arch",
    title: "Market Arch",
    location: "St Nicholas Market",
    description: "A tiled archway made with traders' patterns, celebrating Bristol's market life.",
    tags: ["AR", "Community"],
    pin: { x: 78, y: 22 },
  },
  {
    id: "old-city-mosaic",
    title: "Pavement Mosaic",
    location: "Old City",
    description: "A ground mosaic tracing the medieval shoreline beneath today's pavements.",
    tags: ["AR", "Route stop"],
    pin: { x: 88, y: 62 },
  },
  {
    id: "riverside-totem",
    title: "Riverside Totem",
    location: "Bedminster",
    description: "A stacked timber totem carved during a weekend of community workshops.",
    tags: ["Community"],
    pin: { x: 24, y: 84 },
  },
  {
    id: "station-weave",
    title: "Station Weave",
    location: "Temple Meads",
    description: "Woven steel canopy piece marking arrivals and departures through the city.",
    tags: ["Audio", "Route stop"],
    pin: { x: 66, y: 86 },
  },
];

export const mapPoints: MapPoint[] = [...artworkPoints, ...extraPoints].map((p) =>
  p.id === "charting-change"
    ? {
        ...p,
        featured: true,
        location: "Temple Quarter",
        description:
          "A participatory public artwork exploring women's work, making, memory, and Bristol's changing identity.",
        tags: ["Audio", "AR", "Community Story"],
        thumb: workshopAsset.url,
      }
    : p,
);

export function getMapPoint(id: string) {
  return mapPoints.find((p) => p.id === id);
}
