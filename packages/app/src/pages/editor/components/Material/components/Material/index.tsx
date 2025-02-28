import React, { useState } from "react";
import { Input, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Styles from "./styles.module.less";

const Material: React.FC = () => {
  const [activeKey, setActiveKey] = useState('material');

  const menuItems = [
    {
      key: 'import',
      label: '导入',
      children: [
        {
          key: 'material',
          label: '素材',
        },
        {
          key: 'draft',
          label: '草稿箱',
        },
      ]
    },
    {
      key: 'my',
      label: '我的',
      children: [
        {
          key: 'collection',
          label: '收藏',
        },
        {
          key: 'history',
          label: '历史记录',
        }
      ]
    },
    {
      key: 'ai',
      label: 'AI生成',
    },
    {
      key: 'cloud',
      label: '云素材',
    },
    {
      key: 'official',
      label: '官方素材',
    }
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'material':
        return <div>素材内容</div>;
      case 'draft':
        return <div>草稿箱内容</div>;
      case 'collection':
        return <div>收藏内容</div>;
      case 'history':
        return <div>历史记录内容</div>;
      default:
        return <div>默认内容</div>;
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.leftMenu}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['material']}
          defaultOpenKeys={['import', 'my']}
          items={menuItems}
          className={Styles.menu}
          onSelect={({ key }) => setActiveKey(key)}
        />
      </div>
      <div className={Styles.content}>
        <div className={Styles.list}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Material;