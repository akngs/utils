import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // https://kit.svelte.dev/docs/integrations#preprocessors
  preprocess: [vitePreprocess()],

  kit: {
    // https://kit.svelte.dev/docs/adapters
    adapter: adapter(),
  },
}

export default config
