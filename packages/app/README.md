# APP

## tailwindcss

### 使用说明

1. 应用样式使用tailwindcss，智能提示使用tailwindcss-intellisense插件.
2. 样式使用参考：https://tailwindcss.com/docs/border-radius#examples

### 自定义样式

在App.css通过@theme补充css变量，例如：

```
@theme {
  --color-editor-bg: #000;
  --color-editor-card: #262626;
  --color-editor-fg: #ffffff;
}

```

然后在页面中可通过`bg-editor-bg`直接使用，例如：

```
<div className="h-full w-full flex flex-col bg-editor-bg text-white">...</div>
```
