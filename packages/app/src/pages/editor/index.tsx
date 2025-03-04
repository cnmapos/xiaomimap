// layouts/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "./components//Header/index";
import Material from "./components/Material/index";
import Property from "./components/Property/index";
import "../../styles/editors/index.css";
import Player from "./components/Player/index";
import Timeline from "./components/Timeline/index";

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
              <Player />
            </Panel>

            <PanelResizeHandle className="w-2" />

            <Panel
              defaultSize={33}
              minSize={20}
              className="bg-editor-card rounded-md"
            >
              <Property />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="h-2" />

        {/* 底部关键帧编辑区域 */}
        <Panel defaultSize={40} className="bg-editor-card">
          <Timeline />
        </Panel>
      </PanelGroup>
    </div>
  );
}
