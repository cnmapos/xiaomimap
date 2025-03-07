import {
  BorderOuterOutlined,
  EnvironmentOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  RollbackOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Tabs } from "antd";
import type { TabsProps } from "antd";
import classNames from "classnames";
import { useState } from "react";
import Styles from "./styles.module.less";
const { TabPane } = Tabs;

const MapMenuBar: React.FC = (props: { onFullscreen: () => void }) => {
  const { onFullscreen } = props;
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

  const items = [
    {
      key: "1",
      label: "属性",
      className: "!text-white",
    },
    {
      key: "2",
      label: "删除",
      className: "text-main !font-bold",
    },
    {
      key: "3",
      label: "应用到动画",
      className: "!text-white",

    },
    {
      key: "4",
      label: "生产轨迹动画",
      className: "!text-white",
    },
  ];
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
            {list.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex  justify-between items-center px-2 h-10 border-b-neutral-800 border-b-1 "
                >
                  <div>
                    {item.show ? (
                      <EyeOutlined className="p-1.5" />
                    ) : (
                      <EyeInvisibleOutlined className="p-1.5 !text-neutral-600" />
                    )}
                    {item.type === 1 ? (
                      <EnvironmentOutlined className="p-1.5" />
                    ) : item.type === 2 ? (
                      <RollbackOutlined className="p-1.5" />
                    ) : (
                      <BorderOuterOutlined className="p-1.5" />
                    )}
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Space>
                    {item.star ? (
                      <StarFilled className="!text-amber-500" />
                    ) : (
                      <StarOutlined />
                    )}
                    <Dropdown  placement="bottomLeft" menu={{ 
                      items,
                      className: "!bg-black/80  !ml-5 !-mt-4 !text-white",
                      }}>
                    <MoreOutlined className="cursor-pointer" />

                    </Dropdown>
                  </Space>
                </div>
              );
            })}
          </TabPane>
          <TabPane className="text-white" tab="收藏" key="2">
            222
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default MapMenuBar;
