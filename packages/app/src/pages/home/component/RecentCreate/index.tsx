import { Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { usePagination } from "ahooks";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import VideoRatio, { VideoRatioRef } from "../VideoRatio";
import { getProjectList } from "@/service/api/project";
import "./index.less";

const Main: React.FC = () => {
  const ratioDialogRef = useRef<VideoRatioRef>(null);
  const navigate = useNavigate();

  const { data, loading, run, params } = usePagination(
    ({ current, pageSize }) => {
      return getProjectList({
        current,
        pageSize,
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    run({
      current: 1,
      pageSize: params?.[0]?.pageSize || 10,
    });
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="recent-create-list">
        <Row className="w-full">
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

          {data?.records?.map((item) => {
            return (
              <Col
                span={3}
                onClick={() => navigate(`/editor?projectId=${item.projectId}`)}
              >
                <div className="recent-create-item">
                  <div className="recent-create-item-img mb-4">
                    <img
                      src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png"
                      alt="img"
                    />
                  </div>
                  <p className="text-sm mb-2 text-slate-950 truncate">
                    {item.projectName}
                  </p>
                  <p className="text-xs pb-3 text-gray-400 truncate">
                    {item.createTime}
                  </p>
                </div>
              </Col>
            );
          })}
        </Row>
        <VideoRatio
          onCreate={() => {
            run({
              current: 1,
              pageSize: params?.[0]?.pageSize || 10,
            });
          }}
          ref={ratioDialogRef}
        />
      </div>
    </Spin>
  );
};

export default Main;
