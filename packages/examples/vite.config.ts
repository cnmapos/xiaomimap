import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy';
const viewerSource = 'node_modules/@hztx/core/dist/static';
const viewerBaseUrl = 'resources';

// https://vite.dev/config/
export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(viewerBaseUrl),
    global: {},
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: `${viewerSource}/ThirdParty`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Workers`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Assets`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Widgets`, dest: viewerBaseUrl },
      ],
    }),
  ],
});
