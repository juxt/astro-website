import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import solid from "@astrojs/solid-js";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), solid(), image()],
});
