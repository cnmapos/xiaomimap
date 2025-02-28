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
    // ... 其他 tab 项保持相同结构
  ];

  return (
    <div className={Styles.material}>
      <Tabs
        defaultActiveKey="video"
        items={items}
        className={Styles.tabs}
      />
    </div>
  );
};

export default Material;