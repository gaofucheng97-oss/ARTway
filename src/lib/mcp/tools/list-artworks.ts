import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { artworks } from "@/data/content";

export default defineTool({
  name: "list_artworks",
  title: "List artworks",
  description:
    "List all public artworks in the Artwork Guide, optionally filtered by area (campus, temple, or city). Returns id, title, artist, year, area, location, hook, and tags.",
  inputSchema: {
    area: z
      .enum(["campus", "temple", "city"])
      .optional()
      .describe("Optional area filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ area }) => {
    const filtered = area ? artworks.filter((a) => a.area === area) : artworks;
    const items = filtered.map((a) => ({
      id: a.id,
      title: a.title,
      artist: a.artist,
      year: a.year,
      area: a.area,
      location: a.location,
      hook: a.hook,
      tags: a.tags,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { artworks: items },
    };
  },
});
