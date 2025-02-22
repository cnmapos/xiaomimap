import React from "react";
import { MailOutlined, PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Styles from "./styles.module.less";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "1", icon: <PieChartOutlined />, label: "首页" },
  {
    key: "sub1",
    label: "我的空间",
    icon: <MailOutlined />,
    children: [
      { key: "5", label: "素材" },
      { key: "6", label: "草稿" },
      { key: "7", label: "成品" },
    ],
  },
];

const App: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <div className={Styles.menu}>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default App;
