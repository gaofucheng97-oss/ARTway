import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getArtwork } from "@/data/content";

export default defineTool({
  name: "get_artwork",
  title: "Get artwork details",
  description:
    "Get the full details for a single artwork by id, including artist bio, description, stories, audio guide info, accessibility, and location.",
  inputSchema: {
    id: z.string().describe("The artwork id, e.g. 'charting-change'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const a = getArtwork(id);
    if (!a) {
      return {
        content: [{ type: "text", text: `No artwork found with id "${id}".` }],
        isError: true,
      };
    }
    const { image: _image, ...rest } = a;
    return {
      content: [{ type: "text", text: JSON.stringify(rest, null, 2) }],
      structuredContent: { artwork: rest },
    };
  },
});
