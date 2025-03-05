import React from "react";
import { Tabs } from "antd";
import Styles from "./styles.module.less";
import {
  PlayCircleOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  StarOutlined,
  SwapOutlined,
  FontSizeOutlined,
  FilterOutlined,
  PartitionOutlined,
  LayoutOutlined
} from "@ant-design/icons";
import MaterialContent from "./components/Material/index";

const Material: React.FC = () => {
  const items = [
    {
      key: 'video',
      label: (
        <div className={Styles.tabItem}>
          <PlayCircleOutlined />
          <span>素材</span>
        </div>
      ),
      children: <MaterialContent />,
    },
    {
      key: 'audio',
      label: (
        <div className={Styles.tabItem}>
          <CustomerServiceOutlined />
          <span>音频</span>
        </div>
      ),
      children: <div>音频内容</div>,
    },
    {
      key: 'text',
      label: (
        <div className={Styles.tabItem}>
          <FileTextOutlined />
          <span>文本</span>
        </div>
      ),
      children: <div>文本内容</div>,
    },
    {
      key: 'template',
      label: (
        <div className={Styles.tabItem}>
          <AppstoreOutlined />
          <span>模版</span>
        </div>
      ),
      children: <div>模版内容</div>,
    },
    {
      key: 'effect',
      label: (
        <div className={Styles.tabItem}>
          <StarOutlined />
          <span>特效</span>
        </div>
      ),
      children: <div>特效内容</div>,
    },
    {
      key: 'transition',
      label: (
        <div className={Styles.tabItem}>
          <SwapOutlined />
          <span>转场</span>
        </div>
      ),
      children: <div>转场内容</div>,
    },
    {
      key: 'subtitle',
      label: (
        <div className={Styles.tabItem}>
          <FontSizeOutlined />
          <span>字幕</span>
        </div>
      ),
      children: <div>字幕内容</div>,
    },
    {
      key: 'filter',
      label: (
        <div className={Styles.tabItem}>
          <FilterOutlined />
          <span>滤镜</span>
        </div>
      ),
      children: <div>滤镜内容</div>,
    },
    {
      key: 'split',
      label: (
        <div className={Styles.tabItem}>
          <PartitionOutlined />
          <span>分节</span>
        </div>
      ),
      children: <div>分节内容</div>,
    },
    {
      key: 'layout',
      label: (
        <div className={Styles.tabItem}>
          <LayoutOutlined />
          <span>模版</span>
        </div>
      ),
      children: <div>模版内容</div>,
    },
  ];

  return (
    <div className={Styles.material}>
      <Tabs
        defaultActiveKey="video"
        items={items}
        className={`${Styles.tabs} !h-full`}
      />
    </div>
  );
};

export default Material;