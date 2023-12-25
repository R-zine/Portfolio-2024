import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import htmx from "astro-htmx";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [htmx(), react(), vue(), svelte()],
  adapter: netlify(),
  prefetch: true,
  redirects: {
    "/contact/remove-info": "/remove-info",
    "/route": "/contact",
  },
});
