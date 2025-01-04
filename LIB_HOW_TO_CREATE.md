# 如何创建一个typescript独立库

## 使用 npm 或 yarn 初始化项目：
```
npm init -y
```

## 安装vite、typescript：
```
npm install --save-dev vite typescript
```

##  初始化 TypeScript 配置
生成 tsconfig.json 文件：
```
npx tsc --init
```
根据需要调整 tsconfig.json 配置。以下是一个适合库开发的配置示例：
```
{
  "compilerOptions": {
    "target": "ESNext", // 编译目标为最新的 ES 标准
    "module": "ESNext", // 使用 ES 模块
    "lib": ["DOM", "ESNext"], // 包含的库
    "declaration": true, // 生成 .d.ts 类型声明文件
    "outDir": "dist", // 输出目录
    "strict": true, // 启用严格类型检查
    "esModuleInterop": true, // 支持 CommonJS 和 ES 模块的互操作
    "skipLibCheck": true, // 跳过库文件的类型检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "moduleResolution": "node" // 使用 Node.js 的模块解析策略
  },
  "include": ["src"], // 包含的源代码目录
  "exclude": ["node_modules", "dist"] // 排除的目录
}
```
## = 创建项目结构
创建以下目录结构：
```
my-ts-library/
├── src/
│   ├── index.ts        // 库的入口文件
│   └── utils.ts        // 其他工具函数
├── tests/              // 测试目录
│   └── index.test.ts   // 测试文件
├── dist/               // 构建输出目录
├── package.json        // 项目配置文件
├── tsconfig.json       // TypeScript 配置文件
├── vite.config.ts      // Vite 配置文件
└── README.md           // 项目说明文件
```

## 编写库代码
在 src/index.ts 中编写库的核心代码：
```
// src/index.ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

```

## 配置 Vite
创建 vite.config.ts 文件，配置 Vite 以构建库：
```
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // 库的入口文件
      name: 'MyLibrary', // 全局变量名（用于 UMD 格式）
      fileName: (format) => `my-library.${format}.js`, // 输出文件名
      formats: ['es', 'umd'], // 输出格式（ES 模块和 UMD）
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
```

## 添加构建脚本
在 package.json 中添加构建脚本：
```
{
  "scripts": {
    "build": "vite build",
    "dev": "vite" // 开发模式（可选）
  }
}
```
运行构建命令：
```
npm run build
```

构建完成后，dist/ 目录下会生成以下文件：

my-library.es.js：ES 模块格式。

my-library.umd.js：UMD 格式。

my-library.d.ts：类型声明文件。

## 配置 package.json 发布信息
在 package.json 中配置库的入口文件和类型声明文件：
```
{
  "main": "dist/my-library.umd.js", // UMD 格式的入口文件
  "module": "dist/my-library.es.js", // ES 模块的入口文件
  "types": "dist/index.d.ts", // 类型声明文件
  "files": ["dist"], // 发布时包含的文件
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```