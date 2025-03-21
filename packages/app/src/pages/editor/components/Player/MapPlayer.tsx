import { FullscreenExitOutlined, FullscreenOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import FullPlayer from "./FullPlayer";


const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className="flex flex-col h-full">
      <FullPlayer isFullscreen={isFullscreen} onFullscreen={handleFullscreen} />
      <div className="flex-1 px-3 pt-3">
        <div className="w-full h-full bg-amber-200"></div>
      </div>
      <div className="h-10 flex justify-between items-center px-3">
        <div className="text-xs w-24">
          <span className="text-cyan-300">00:00:05:00</span>
          <span className="px-1 text-neutral-500">/</span>
          <span className="text-neutral-500">00:00:00:00</span>
        </div>
        <span>
          <span onClick={handlePlayPause} className="cursor-pointer text-white"> {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}</span>
        </span>
        {/* 全屏 */}
        <div className=" w-24 flex cursor-pointer  text-white justify-end">
          <span onClick={handleFullscreen}> {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}</span>
        </div>
      </div>
    </div>
  );
};

export default Player;