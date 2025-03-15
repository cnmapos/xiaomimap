import React, { useState, useEffect } from "react";
import { Empty, Input, Button, Upload } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import Styles from "./styles.module.less";
import ImportBar from "../../../Import";
import ImportMap from "../../../Import/Map";
import { listProjectAsset } from "@/service/api/project";

const MaterialList: React.FC = () => {
  const [mode, setMode] = useState(-1);
  const [data, setData] = useState([]);
  const mockData = [
    {
      id: 1,
      title: "峨眉山.mp4",
      cover:
        "https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png",
    },
    {
      id: 2,
      title: "乐山大佛.mp4",
      cover:
        "https://static.yximgs.com/udata/pkg/admin-center/51d3c1da0ef4b628d7ec185264afedf55d1661b7.png",
    },
  ];

  useEffect(() => {
    listProjectAsset({
      current: 1,
      pageSize: 10,
      projectId: 1,
      userId: 9,
    }).then((res) => {
      setData(res.data.list);
    });
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <ImportBar onSelectMode={(mode) => setMode(mode)}></ImportBar>
      </div>
      <div className={Styles.content}>
        {mode === 2 ? (
          <ImportMap onSelectMode={(mode) => setMode(mode)}></ImportMap>
        ) : null}
        {mockData.length > 0 ? (
          <div className={Styles.list}>
            {mockData.map((item) => (
              <div key={item.id} className={Styles.item}>
                <div className={Styles.cover}>
                  <img src={item.cover} alt={item.title} />
                </div>
                <div className={Styles.title} title={item.title}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无素材" />
        )}
      </div>
    </div>
  );
};

export default MaterialList;
