// layouts/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "./components//Header/index";
import Material from "./components/Material/index";
import "../../styles/editors/index.css";

export default function MainLayout() {
  return (
    <div className="h-full w-full flex flex-col bg-editor-bg text-white">
      <Header></Header>
      <PanelGroup direction="vertical" className="w-full">
        {/* 顶部预览区域 */}
        <Panel defaultSize={60}>
          <PanelGroup direction="horizontal">
            <Panel
              defaultSize={33}
              minSize={20}
              className="bg-editor-700 bg-editor-card rounded-md"
            >
              <Material />
            </Panel>

            <PanelResizeHandle className="w-2" />

            <Panel
              defaultSize={33}
              minSize={20}
              className="bg-editor-card  rounded-md"
            >
              <div>动画预览区域</div>
            </Panel>

            <PanelResizeHandle className="w-2" />

            <Panel
              defaultSize={33}
              minSize={20}
              className="bg-editor-card  rounded-md"
            >
              <div>属性面板</div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="h-2" />

        {/* 底部关键帧编辑区域 */}
        <Panel defaultSize={40} className="bg-editor-card">
          <div>动画关键帧区域</div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
