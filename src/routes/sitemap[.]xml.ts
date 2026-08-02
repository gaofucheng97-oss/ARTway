import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { artworks } from "@/data/content";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/",
          "/map",
          "/routes",
          "/route-progress",
          "/community",
          "/community/featured",
          "/community/create",
          "/account",
          "/account/map",
          "/account/visited",
          "/account/saved",
          "/account/contributions",
          "/account/stories",
          "/account/stamps",
          "/account/settings",
          ...artworks.map((a) => `/artwork/${a.id}`),
          ...artworks.map((a) => `/community/forum/${a.id}`),
        ];
        const urls = paths
          .map((p) => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
