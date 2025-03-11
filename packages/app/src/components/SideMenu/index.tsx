import React, { useEffect, useState } from "react";
import { MailOutlined, PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { Menu } from "antd";
import Styles from "./styles.module.less";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "home", icon: <PieChartOutlined />, label: "首页" },
  {
    key: "workspace",
    label: "我的空间",
    icon: <MailOutlined />,
    children: [
      { key: "material", label: "素材" },
      { key: "draft", label: "草稿" },
      { key: "product", label: "成品" },
    ],
  },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  useEffect(() => {
    const keys = location.pathname.split("/").filter(Boolean);
    setSelectedKeys(keys);
    // setOpenKeys([keys?.[0]]);
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    const path = e.keyPath.reverse().join("/");
    console.log(e)
    navigate(path);
  };

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className={Styles.menu}>
      <Menu
        onClick={onClick}
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
      />
    </div>
  );
};

export default App;
