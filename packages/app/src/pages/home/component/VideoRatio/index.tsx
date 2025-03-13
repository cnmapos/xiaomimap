import React, { forwardRef, Ref, useState, useImperativeHandle } from "react";
import { Button, Modal, Row, Col, message } from "antd";
import { createProject } from "@/service/api/project";

import classNames from "classnames";

import "./index.less";

const VideoRatio = forwardRef(
  (
    props,
    ref: Ref<{
      open: () => void;
    }>
  ) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [ratio, setRatio] = useState("");

    const handleCreate = async () => {
      const data = await createProject({
        screenRatio: ratio,
        projectName: "未命名草稿",
      });
      if (data.code === 0) {
        setOpen(false);
      } else {
        message.error(data.msg || "创建失败");
      }
      console.log(data);
    };

    const handleCancel = () => {
      setOpen(false);
    };

    useImperativeHandle(ref, () => {
      return {
        open: () => {
          setOpen(true);
        },
      };
    });

    return (
      <>
        <Modal
          open={open}
          width={700}
          title="给你的视频选择一个宽高比"
          onCancel={handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleCreate}
            >
              创建
            </Button>,
          ]}
        >
          <Row className="video-ratio pb-4 text-center" gutter={16}>
            <Col
              span={6}
              className={classNames("hover:text-blue-500", {
                "video-ratio-active": ratio === "9:16",
              })}
            >
              <div
                className="video-ratio-item relative border border-transparent hover:border-blue-600"
                onClick={() => setRatio("9:16")}
              >
                <img
                  className="absolute top-0 object-contain h-full w-full"
                  src="https://onvideo-img.ssrcdn.com/kos/nlav10711/v2/static/images/create-sample-9-16.webp"
                  alt=""
                />
              </div>
              <h5 className="text-xl mb-1 mt-1">9:16</h5>
              <p className="text-gray-400">适合手机设备观看</p>
            </Col>
            <Col
              span={6}
              className={classNames("hover:text-blue-500", {
                "video-ratio-active": ratio === "16:9",
              })}
            >
              <div
                className="video-ratio-item relative border border-transparent hover:border-blue-600"
                onClick={() => setRatio("16:9")}
              >
                <img
                  className="absolute top-0 object-contain h-full w-full"
                  src="https://onvideo-img.ssrcdn.com/kos/nlav10711/v2/static/images/create-sample-16-9.webp"
                  alt=""
                />
              </div>
              <h5 className="text-xl mb-1 mt-1">16:9</h5>
              <p className="text-gray-400">适合电脑设备观看</p>
            </Col>
            <Col
              span={6}
              className={classNames("hover:text-blue-500", {
                "video-ratio-active": ratio === "4:3",
              })}
            >
              <div
                className="video-ratio-item relative border border-transparent hover:border-blue-600"
                onClick={() => setRatio("4:3")}
              >
                <img
                  className="absolute top-0 object-contain h-full w-full"
                  src="https://onvideo-img.ssrcdn.com/kos/nlav10711/v2/static/images/create-sample-4-3.webp"
                  alt=""
                />
              </div>
              <h5 className="text-xl mb-1 mt-1">4:3</h5>
              <p className="text-gray-400">适合老片怀旧</p>
            </Col>
            <Col
              span={6}
              className={classNames("hover:text-blue-500", {
                "video-ratio-active": ratio === "1:1",
              })}
            >
              <div
                className="video-ratio-item relative border border-transparent hover:border-blue-600"
                onClick={() => setRatio("1:1")}
              >
                <img
                  className="absolute top-0 object-contain w-25 h-25 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2"
                  src="https://onvideo-img.ssrcdn.com/kos/nlav10711/v2/static/images/create-sample-1-1.webp"
                  alt=""
                />
              </div>
              <h5 className="text-xl mb-1 mt-1">1:1</h5>
              <p className="text-gray-400">适合电商视频播放</p>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
);

export default VideoRatio;
