// layouts/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function MainLayout() {
  return (
    <PanelGroup direction="vertical" className="">
      {/* 顶部预览区域 */}

      <Panel defaultSize={60}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15}>
            <div>素材编辑区域</div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-800 hover:bg-blue-500" />

          <Panel>
            <div>动画预览区域</div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-800 hover:bg-blue-500" />

          <Panel defaultSize={25} minSize={20}>
            <div>属性面板</div>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle className="h-2 bg-gray-800 hover:bg-blue-500" />

      {/* 底部关键帧编辑区域 */}
      <Panel defaultSize={40}>
        <div>动画关键帧区域</div>
      </Panel>
    </PanelGroup>
  );
}
