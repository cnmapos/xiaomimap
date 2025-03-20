import { FullscreenExitOutlined, FullscreenOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Slider } from "antd";
import { useState } from "react";


const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 全屏 */}
      {
        isFullscreen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 bg-neutral-900">
            <div className="bg-amber-200 h-full w-full"> </div>
            <div className="absolute bottom-10  z-50 w-full" >
              <div style={{ minWidth: 600 }} className="h-10 bg-neutral-900/80 w-1/3 mx-auto rounded-sm flex px-3 text-white justify-between items-center">
                <div className="flex items-center pr-2">
                  <span className="cursor-pointer text-white mr-2"> {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}</span>
                  <div className="text-xs">
                    <span className="text-cyan-300">00:00:05:00</span>
                    <span className="px-1 text-neutral-500">/</span>
                    <span className="text-white">00:00:00:00</span>
                  </div>
                </div>
                <div className="flex-1 px-1.5"><Slider className="w-full !m-0" defaultValue={30} styles={{
                  rail: {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                }} /></div>
                <div className="pl-2">
                  <span className="cursor-pointer text-white" onClick={handleFullscreen}> {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
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