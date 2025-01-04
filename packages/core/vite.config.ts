import { defineConfig } from 'vite';
import path from 'path';

async function loadPlugins() {
    const { viteStaticCopy } = await import('vite-plugin-static-copy'); // 使用动态导入
    return viteStaticCopy;
}

const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = 'static';

export default defineConfig(async () => {
    const viteStaticCopy = await loadPlugins(); // 在异步函数中加载插件

    return {
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: 'core',
                fileName: (format) => `core.${format}.js`,
                formats: ['es', 'umd'],
            },
            rollupOptions: {
                output: {
                    globals: {
                        // 如果有外部依赖，可以在这里配置全局变量名
                    },
                },
            },
        },
        plugins: [
            viteStaticCopy({
                targets: [
                    { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
                    { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
                    { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
                    { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl }
                ],
            }),
        ],
    };
});