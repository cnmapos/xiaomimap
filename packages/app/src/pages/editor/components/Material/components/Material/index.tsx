import React, { useState } from "react";
import { Input, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ImportMaterial from '../Import';
import Styles from "./styles.module.less";
import MaterialList from "./components/List";
import DraftList from "./components/DraftList";
import CollectionList from "./components/CollectionList";
import HistoryList from "./components/HistoryList";

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
    // {
    //   key: 'ai',
    //   label: 'AI生成',
    // },
    // {
    //   key: 'cloud',
    //   label: '云素材',
    // },
    // {
    //   key: 'official',
    //   label: '官方素材',
    // }
  ];

  const renderContent = () => {
    switch (activeKey) {
      case 'material':
        return <MaterialList />;
      case 'draft':
        return <DraftList />;
      case 'collection':
        return <CollectionList />;
      case 'history':
        return <HistoryList />;
      default:
        return <MaterialList />;
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
      <div className='w-full'>
        <div className={`${Styles.list} h-full`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Material;