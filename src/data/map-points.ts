import { artworks } from "./content";

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

/** The permanent artworks listed by the University of Bristol Public Art site. */
const artworkPoints: MapPoint[] = artworks.map((a) => ({
  id: a.id,
  title: a.title,
  location: a.location,
  description: a.description,
  tags: [
    "Permanent artwork",
    ...a.tags.slice(1, 2),
  ],
  thumb: a.image,
  pin: a.pin,
  artworkId: a.id,
}));

export const mapPoints: MapPoint[] = artworkPoints.map((point) => ({
  ...point,
  featured: point.id === "hollow",
}));

export function getMapPoint(id: string) {
  return mapPoints.find((p) => p.id === id);
}
