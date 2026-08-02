import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getRoute, getArtwork } from "@/data/content";

export default defineTool({
  name: "get_route",
  title: "Get curated route",
  description:
    "Get a curated route by id, including its ordered list of artwork stops with titles and locations.",
  inputSchema: {
    id: z.string().describe("The route id, e.g. 'temple-quarter-stories'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const r = getRoute(id);
    if (!r) {
      return {
        content: [{ type: "text", text: `No route found with id "${id}".` }],
        isError: true,
      };
    }
    const stops = r.artworkIds
      .map((aid) => {
        const a = getArtwork(aid);
        return a
          ? { id: a.id, title: a.title, artist: a.artist, location: a.location }
          : { id: aid, title: aid, artist: "", location: "" };
      });
    const payload = { ...r, stops };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { route: payload },
    };
  },
});
