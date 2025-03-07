import {
  BorderOuterOutlined,
  EnvironmentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import List from "./List";
import classNames from "classnames";
import { useState } from "react";
import Styles from "./styles.module.less";
const { TabPane } = Tabs;

const MapMenuBar: React.FC = () => {
  // 是否展开
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState<any[]>([
    {
      name: "点位1",
      type: 1,
      show: true,
      star: true,
    },
    {
      name: "线条1",
      type: 2,
      show: true,
      star: false,
    },
    {
      name: "面1",
      type: 3,
      show: false,
      star: false,
    },
  ]);

  
  // w-50
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="flex absolute bg-neutral-800 h-full">
      <div className="icon w-12 flex flex-col items-center">
        <span
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 px-1.5 flex items-center border-b-neutral-800 border-b-1"
        >
          {collapsed ? (
            <MenuFoldOutlined className="p-1.5 cursor-pointer bg-cyan-300" />
          ) : (
            <MenuUnfoldOutlined className="p-1.5 cursor-pointer bg-cyan-300" />
          )}
        </span>
        <span className="h-10 px-1.5 border-b-neutral-800 border-b-1 flex items-center">
          <EnvironmentOutlined className="p-1.5" />
        </span>
        <span className="h-10 px-1.5 border-b-neutral-800 border-b-1  flex items-center">
          <RollbackOutlined className="p-1.5" />
        </span>
        <span className="h-10  px-1.5 border-b-neutral-800 border-b-1  flex items-center">
          <BorderOuterOutlined className="p-1.5" />
        </span>
      </div>
      <div
        className={classNames(
          "w-0 overflow-hidden transition-all border-l-neutral-800 border-l-1",
          {
            "w-50": collapsed,
          }
        )}
      >
        <Tabs className={Styles.tabs} defaultActiveKey="1" onChange={onChange}>
          <TabPane className="text-white" tab="要素" key="1">
            <List data={list}></List>
          </TabPane>
          <TabPane className="text-white" tab="收藏" key="2">
            <List data={list}></List>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MapMenuBar;
