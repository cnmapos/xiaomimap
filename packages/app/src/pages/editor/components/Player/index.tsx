import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import Styles from './styles.module.less';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={Styles.player}>
      <div className={Styles.videoContainer}>
        <video
          ref={videoRef}
          className={Styles.video}
          src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.mp4"
        />
      </div>
      <div className={Styles.controls}>
        <Button
          type="text"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={handlePlayPause}
        />
      </div>
    </div>
  );
};

export default Player;