import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkCollapse from "remark-collapse";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import { pluginShiki, pluginFrames } from "astro-expressive-code";
import rehypeExpressiveCode from "rehype-expressive-code";
import { SITE } from "./src/config";
import { isOfficialCtoMigratedPath } from "./src/data/officialCtoMigration";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    expressiveCode({
      // Explicitly list plugins to exclude pluginTextMarkers (which causes
      // spurious line highlights on comment separators like # -----)
      plugins: [pluginShiki(), pluginFrames()],
      themes: ["night-owl", "min-light"],
      defaultProps: {
        wrap: false,
      },
    }),
    sitemap({
      filter: page => {
        const pathname = new URL(page).pathname;

        return (
          (SITE.showArchives || pathname !== "/archives/") &&
          !isOfficialCtoMigratedPath(pathname) &&
          !pathname.startsWith("/agentic-ai/") &&
          pathname !== "/learning/agentic-ai/"
        );
      },
    }),
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypeExpressiveCode,
          {
            plugins: [pluginShiki(), pluginFrames()],
            themes: ["night-owl", "min-light"],
          },
        ],
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
