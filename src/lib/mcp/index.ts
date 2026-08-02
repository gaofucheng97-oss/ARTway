import { defineMcp } from "@lovable.dev/mcp-js";
import listArtworks from "./tools/list-artworks";
import getArtwork from "./tools/get-artwork";
import listRoutes from "./tools/list-routes";
import getRoute from "./tools/get-route";

export default defineMcp({
  name: "artwork-guide-mcp",
  title: "Artwork Guide",
  version: "0.1.0",
  instructions:
    "Tools for the Bristol Artwork Guide. Use list_artworks and get_artwork to browse public artworks and their stories, and list_routes / get_route to explore curated walking routes.",
  tools: [listArtworks, getArtwork, listRoutes, getRoute],
});
