import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { curatedRoutes } from "@/data/content";

export default defineTool({
  name: "list_routes",
  title: "List curated routes",
  description:
    "List curated walking routes through Bristol public art. Optionally filter by route type: quick, recommend, or deep.",
  inputSchema: {
    type: z.enum(["quick", "recommend", "deep"]).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ type }) => {
    const items = type ? curatedRoutes.filter((r) => r.type === type) : curatedRoutes;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { routes: items },
    };
  },
});
