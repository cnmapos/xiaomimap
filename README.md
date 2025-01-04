# XIAOMIMAP

开发前请仔细阅读开发准则:[DEVELOP_GUIDE](./DEVELOP_GUIDE.md)

## 开发环境
- node: >= v21.6.2

## 项目初始化
- 安装pnpm `npm install -g pnpm`

## 运行examples

进入packages/examples目录，执行：
```
pnpm install
pnpm run dev
```

## packages
- core：地图基础库
- animations:地图动画

## pnpm常用指令

- 安装工作区依赖
```
// 例如在core包中定义了@hztx/core，然后在根目录下执行
pnpm add @hztx/core --workspace -w
```
// 在相应的应用包中安装依赖，如packages/examples：
```
pnpm add @hztx/core
```

