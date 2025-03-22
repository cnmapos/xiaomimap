import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { createViewer, IViewer } from "@hztx/core";
import classNames from "classnames";
import { Slider, Tooltip } from "antd";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // 单独控制全屏播放
  const [isFullscreenPlaying, setIsFullscreenPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapEle = useRef<HTMLElement>();
  const context = useRef<{ viewer: IViewer | null }>({ viewer: null });

  useEffect(() => {
    const viewer = createViewer(mapEle.current!, {
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI",
    });
    context.current.viewer = viewer;

    return () => {
      viewer.destroy();
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreenPlayPause = () => {
    setIsFullscreenPlaying(!isFullscreenPlaying);
  };

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className="flex flex-col h-full">
      <div
        className={classNames(
          "w-full flex-1 flex justify-center overflow-hidden",
          {
            "fixed left-0 top-0 w-full h-full z-10 right-0 bottom-0":
              isFullscreen,
          }
        )}
      >
        <div
          className="h-full w-full"
          style={{ aspectRatio: "9/16" }}
          ref={mapEle}
        ></div>
        {/* 全屏控制 */}
        {isFullscreen && (
          <div className="absolute bottom-10  z-50 w-full">
            <div
              style={{ minWidth: 600 }}
              className="h-10 bg-neutral-900/80 w-1/3 mx-auto rounded-sm flex px-3 text-white justify-between items-center"
            >
              <div className="flex items-center pr-2">
                <span
                  className="cursor-pointer text-white mr-2"
                  onClick={handleFullscreenPlayPause}
                >
                  {isFullscreenPlaying ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )}
                </span>
                <div className="text-xs">
                  <span className="text-cyan-300">00:00:05:00</span>
                  <span className="px-1 text-neutral-500">/</span>
                  <span className="text-white">00:00:00:00</span>
                </div>
              </div>
              <div className="flex-1 px-1.5">
                <Slider
                  className="w-full !m-0"
                  defaultValue={30}
                  styles={{
                    rail: {
                      background: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                />
              </div>
              <div className="pl-2">
                <span
                  className="cursor-pointer text-white"
                  onClick={handleFullscreen}
                >
                  {isFullscreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-10 flex justify-between items-center px-3">
        <div className="text-xs w-24">
          <span className="text-cyan-300">00:00:05:00</span>
          <span className="px-1 text-neutral-500">/</span>
          <span className="text-neutral-500">00:00:00:00</span>
        </div>
        <span>
          <span onClick={handlePlayPause} className="cursor-pointer text-white">
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </span>
        </span>
        {/* 全屏 */}
        <div className=" w-24 flex cursor-pointer  text-white justify-end">
          <Tooltip title="全屏" color="#00b9c4">
            <span onClick={handleFullscreen}>
              {isFullscreen ? (
                <FullscreenExitOutlined />
              ) : (
                <FullscreenOutlined />
              )}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Player;
