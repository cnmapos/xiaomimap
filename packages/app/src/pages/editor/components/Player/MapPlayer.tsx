import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import FullPlayer from "./FullPlayer";
import { createViewer, IViewer } from "@hztx/core";

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className="flex flex-col h-full">
      <FullPlayer isFullscreen={isFullscreen} onFullscreen={handleFullscreen} />
      <div className="w-full flex-1 flex justify-center overflow-hidden">
        <div
          className="h-full"
          style={{ aspectRatio: "9/16" }}
          ref={mapEle}
        ></div>
      </div>
      <div className="h-10 flex justify-between items-center px-3">
        <div className="text-xs w-24">
          <span className="text-cyan-300">00:00:05:00</span>
          <span className="px-1 text-neutral-500">/</span>
          <span className="text-neutral-500">00:00:00:00</span>
        </div>
        <span>
          <span onClick={handlePlayPause} className="cursor-pointer text-white">
            {" "}
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </span>
        </span>
        {/* 全屏 */}
        <div className=" w-24 flex cursor-pointer  text-white justify-end">
          <span onClick={handleFullscreen}>
            {" "}
            {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Player;
