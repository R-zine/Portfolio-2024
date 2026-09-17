import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import htmx from "astro-htmx";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    htmx(),
    react({
      // This entry is mounted after runtime capability checks rather than as an
      // Astro island. Vite still compiles TSX, while excluding it from Fast
      // Refresh avoids requiring an island-injected refresh preamble.
      exclude: /src\/components\/React\/(?:Home|mountHome)\.tsx$/,
    }),
    vue(),
    svelte({ prebundleSvelteLibraries: false }),
  ],
  adapter: netlify(),
  prefetch: true,
  redirects: {
    "/contact/remove-info": "/remove-info",
    "/route": "/contact",
  },
});
