// layouts/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Header from "./Header";
import "../../styles/editors/index.css";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/useEditorStore";
import { StateService } from "@/core/services/StateService";
import { ServiceRegistry } from "@/core/services/ServiceRegistry";

export default function MainLayout() {
  const store = useEditorStore();
  useEffect(() => {
    const stateService = new StateService(store);
    ServiceRegistry.register(stateService);
  }, []);

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
              <div>素材编辑区域</div>
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
