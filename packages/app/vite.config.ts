import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist', // 输出目录
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // 入口文件
      }
    }
  },
  server: {
    open: true,
    proxy: {
      '/hz-users': {
        target: 'http://42.51.33.23:8012/huize-map',
        changeOrigin: true,
      }
    }
  }
})