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
import { useState, forwardRef, useImperativeHandle } from "react";
import { CreateType, PreviewListType } from "./Map";
import Styles from "./styles.module.less";
const { TabPane } = Tabs;

interface MapMenuBarProps {
  onStartCreate: (v: CreateType) => void;
  list: PreviewListType[];
}
export interface MapMenuBarRef {
  updateType: (v: number) => void;
}

const MapMenuBar = forwardRef<MapMenuBarRef, MapMenuBarProps>((props, ref) => {
  const { onStartCreate, list } = props;
  // 是否展开
  const [collapsed, setCollapsed] = useState(false);
  const [type, setType] = useState(-1);
  const onChange = (key: string) => {
    console.log(key);
  };
  useImperativeHandle(ref, () => ({
    updateType: (v: number) => {
      setType(v);
    },
  }));

  return (
    <div className="flex absolute bg-neutral-800 h-full z-10">
      <div className="icon w-12 flex flex-col items-center">
        <span
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 px-1.5 flex items-center border-b-neutral-600 border-b-1"
        >
          {collapsed ? (
            <MenuFoldOutlined className="p-1.5 cursor-pointer bg-cyan-300" />
          ) : (
            <MenuUnfoldOutlined className="p-1.5 cursor-pointer bg-cyan-300" />
          )}
        </span>
        <span
          onClick={() => {
            onStartCreate("point");
            setType(1);
          }}
          className={classNames(
            '"cursor-pointer h-10 px-1.5 border-b-neutral-600 border-b-1 flex items-center"',
            {
              "!text-cyan-300": type === 1,
            }
          )}
        >
          <EnvironmentOutlined className="p-1.5" />
        </span>
        <span
          onClick={() => {
            onStartCreate("line");
            setType(2);
          }}
          className={classNames(
            "cursor-pointer h-10 px-1.5 border-b-neutral-600 border-b-1  flex items-center",
            {
              "!text-cyan-300": type === 2,
            }
          )}
        >
          <RollbackOutlined className="p-1.5" />
        </span>
        <span
          onClick={() => {
            onStartCreate("polygon");
            setType(3);
          }}
          className={classNames(
            "cursor-pointer h-10  px-1.5 border-b-neutral-600 border-b-1  flex items-center",
            {
              "!text-cyan-300": type === 3,
            }
          )}
        >
          <BorderOuterOutlined className="p-1.5" />
        </span>
      </div>
      <div
        className={classNames(
          "w-0 overflow-hidden transition-all border-l-neutral-600 border-l-1",
          {
            "w-50": collapsed,
          }
        )}
      >
        <Tabs className={Styles.tabs} defaultActiveKey="1" onChange={onChange}>
          <TabPane className="text-white" tab="要素" key="1">
            {list.length ? (
              <List data={list}></List>
            ) : (
              <div className="text-center text-white p-5">暂无数据</div>
            )}
          </TabPane>
          <TabPane className="text-white" tab="收藏" key="2">
            {list.length ? (
              <List data={list}></List>
            ) : (
              <div className="text-center text-white p-5">暂无数据</div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
});

export default MapMenuBar;
