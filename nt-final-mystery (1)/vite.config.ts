import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function imagePreloadPlugin() {
  return {
    name: 'image-preload',
    transform(code: string, id: string) {
      if (id.endsWith('App.tsx')) {
        const matches = [...code.matchAll(/https:\/\/(?:i\.postimg\.cc|media\.giphy\.com)[^"'\s\\]+\.(?:png|gif|jpe?g)/g)].map(m => m[0]);
        const uniqueUrls = [...new Set(matches)];
        // Replace ONLY if we find the exact structure we expect in App.tsx
        return code.replace(
          /const PRELOAD_IMAGES = \[[\s\S]*?\];/,
          `const PRELOAD_IMAGES = ${JSON.stringify(uniqueUrls)};`
        );
      }
      return code;
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), imagePreloadPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
