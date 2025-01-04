# @hztx/core

## 使用方式

### vite项目配置
在vite.config.ts中添加配置
```
import {viteStaticCopy} from 'vite-plugin-static-copy'
const viewerSource = "node_modules/@hztx/core/dist/static";
const viewerBaseUrl = "resources";

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(viewerBaseUrl),
  },
  ...
  plugins: [
    ...
    viteStaticCopy({
      targets: [
        { src: `${viewerSource}/ThirdParty`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Workers`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Assets`, dest: viewerBaseUrl },
        { src: `${viewerSource}/Widgets`, dest: viewerBaseUrl },
      ],
    }),
  ],
})


```