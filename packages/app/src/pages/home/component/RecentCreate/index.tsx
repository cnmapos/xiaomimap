import { Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { usePagination } from "ahooks";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import VideoRatio, { VideoRatioRef, VideoRatioType } from "../VideoRatio";
import { getProjectList } from "@/service/api/project";
import dayjs from "dayjs";
import "./index.less";

const RatioIconStyle = {
  [VideoRatioType.NineToSixteen]: {
    width: 8,
    height: 8 / (9 / 16),
  },
  [VideoRatioType.FourToThree]: {
    width: 14,
    height: 14 / (4 / 3),
  },
  [VideoRatioType.OneToOne]: {
    width: 10,
    height: 10,
  },
  [VideoRatioType.SixteenToNine]: {
    width: 14,
    height: 14 / (16 / 9),
  },
};

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
                    <span className="bg-black/40 flex items-center text-xs z-10 absolute left-2 bottom-2 font-bold text-white px-1.5 py-0.5 rounded-sm">
                      {item.screenRatio}
                      <i
                        style={{
                          ...RatioIconStyle[item.screenRatio],
                          borderRadius: 1,
                        }}
                        className="inline-block bg-white/30 ml-1 border border-white"
                      ></i>
                    </span>
                    <img
                      className="z-0"
                      src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png"
                      alt="img"
                    />
                  </div>
                  <p className="text-sm mb-2 text-slate-950 truncate">
                    {item.projectName}
                  </p>
                  <p className="text-xs pb-3 text-gray-400 truncate">
                    {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
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
