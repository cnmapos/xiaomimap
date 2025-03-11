import { Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useRef } from "react";
import VideoRatio from "../VideoRatio";

import "./index.less";

const Main: React.FC = () => {
  const ratioDialogRef = useRef<{
    open: () => void;
  } | null>(null);




  return (
    <div className="recent-create-list">
      <Row>
        <Col span={3}>
          <div className="recent-create-item create">
            <div className="recent-create-item-img">
              <span
                onClick={() => ratioDialogRef.current!.open?.()}
                className="absolute  flex flex-col bg-gray-100 justify-center items-center w-full h-full top-0"
              >
                <PlusOutlined className="text-2xl" />
                <span className="block mt-2 font-bold">创作新视频</span>
              </span>
            </div>
          </div>
        </Col>
        {Array(7)
          .fill(null)
          .map(() => {
            return (
              <Col span={3}>
                <div className="recent-create-item">
                  <div className="recent-create-item-img mb-4">
                    <img
                      src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png"
                      alt="img"
                    />
                  </div>
                  <p className="text-sm mb-2 text-slate-950 truncate">
                    cat catcatcatcatcatcatcatcatcatcatcatcatcatcat
                  </p>
                  <p className="text-xs pb-3 text-gray-400 truncate">
                    今日 20:44
                  </p>
                </div>
              </Col>
            );
          })}
      </Row>
      <VideoRatio ref={ratioDialogRef} />
    </div>
  );
};

export default Main;
