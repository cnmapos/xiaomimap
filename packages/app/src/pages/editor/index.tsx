// layouts/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/useAnimationStore";
import { StateService } from "@/core/services/StateService";
import { ServiceRegistry } from "@/core/services/ServiceRegistry";
import { ConfigProvider } from "antd";
import Header from "./components//Header/index";
import Material from "./components/Material/index";
import Property from "./components/Property/index";
import "../../styles/editors/index.less";
import Player from "./components/Player/index";
import Timeline from "./components/Timeline/index";

/**
 *  使用ConfigProvider 包裹，因为editor的样式其他主题色
 *
 */
export default function MainLayout() {
  const store = useEditorStore();
  useEffect(() => {
    const stateService = new StateService(store);
    ServiceRegistry.register(stateService);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00B9C4",
        },
      }}
    >
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
    </ConfigProvider>
  );
}
