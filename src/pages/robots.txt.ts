import type { APIRoute } from "astro";
import { officialCtoMigratedPathPrefixes } from "@/data/officialCtoMigration";

const migratedDisallowRules = officialCtoMigratedPathPrefixes
  .map(path => `Disallow: ${path}/`)
  .join("\n");

const aiCrawlerRules = ["GPTBot", "Google-Extended", "Google-CloudVertexBot"]
  .map(
    userAgent => `User-agent: ${userAgent}
${migratedDisallowRules}`
  )
  .join("\n\n");

const getRobotsTxt = (sitemapURL: URL) => `${aiCrawlerRules}

User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
