import React from "react";
import { Empty } from "antd";
import Styles from "./styles.module.less";

const MaterialList: React.FC = () => {
  return (
    <div className={Styles.container}>
      <Empty description="暂无素材" />
    </div>
  );
};

export default MaterialList;