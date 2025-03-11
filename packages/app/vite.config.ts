import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
const viewerSource = "node_modules/@hztx/core/dist/static";
const viewerBaseUrl = "resources";

// https://vite.dev/config/
export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(viewerBaseUrl),
    global: {},
  },
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: `${viewerSource}/ThirdParty`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Workers`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Assets`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Widgets`, dest: viewerBaseUrl },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // 输出目录
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // 入口文件
      },
    },
  },
  server: {
    open: true,
    proxy: {
      "/hz-users": {
        target: "http://42.51.33.23:8012/huize-map",
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 如果需要支持 Less 中的 JavaScript 表达式
      },
    },
  },
});
