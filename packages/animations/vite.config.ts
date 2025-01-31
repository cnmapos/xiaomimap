import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // 库的入口文件
      name: "animations", // 全局变量名（用于 UMD 格式）
      fileName: (format) => `animations.${format}.js`, // 输出文件名
      formats: ["es", "umd"], // 输出格式（ES 模块和 UMD）
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        globals: {
          // 如果有外部依赖，可以在这里配置全局变量名
        },
      },
    },
  },
});
