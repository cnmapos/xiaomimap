import React, { useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  PlayCircleOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  ScissorOutlined,
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import Styles from "./styles.module.less";

interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio';
  thumbnails?: string[];
  waveform?: number[];
  keyframes?: {
    id: string;
    time: number;
    type: string;
  }[];
}

const Timeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(1);
  const [tracks, setTracks] = useState<Track[]>([
    { 
      id: '1', 
      name: '视频', 
      type: 'video', 
      thumbnails: Array(20).fill('https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png'),
      keyframes: [
        { id: 'k1', time: 30, type: 'scale' },
        { id: 'k2', time: 60, type: 'position' }
      ]
    },
    { 
      id: '2', 
      name: '打点声', 
      type: 'audio', 
      waveform: Array(100).fill(0).map(() => Math.random())
    }
  ]);
  
  const [currentTime, setCurrentTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setCurrentTime(Math.floor(x / (60 * scale)));
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTracks(items);
  };

  return (
    <div className={Styles.timeline}>
      <div className={Styles.toolbar}>
        <div className={Styles.left}>
          <Tooltip title="上一帧">
            <Button icon={<StepBackwardOutlined />} />
          </Tooltip>
          <Button 
            icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <Tooltip title="下一帧">
            <Button icon={<StepForwardOutlined />} />
          </Tooltip>
        </div>
        <div className={Styles.center}>00:00:05.00</div>
        <div className={Styles.right}>
          <Tooltip title="剪切">
            <Button icon={<ScissorOutlined />} />
          </Tooltip>
          <Tooltip title="删除">
            <Button icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={() => setScale(s => Math.min(s + 0.1, 2))} />
          </Tooltip>
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} />
          </Tooltip>
        </div>
      </div>

      <div className={Styles.ruler} onClick={handleTimelineClick} ref={timelineRef}>
        <div className={Styles.timeIndicator} style={{ left: currentTime * 60 * scale }}/>
        <div className={Styles.rulerContent} style={{ transform: `scaleX(${scale})` }}>
          {Array(120).fill(0).map((_, i) => (
            <div key={i} className={Styles.rulerTick}>
              <span>{Math.floor(i / 30)}:{(i % 30 * 2).toString().padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tracks">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={Styles.tracks}
            >
              {tracks.map((track, index) => (
                <Draggable key={track.id} draggableId={track.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={Styles.track}
                    >
                      <div className={Styles.trackHeader} {...provided.dragHandleProps}>
                        {track.name}
                      </div>
                      <div className={Styles.trackContent} style={{ transform: `scaleX(${scale})` }}>
                        {track.type === 'video' && (
                          <>
                            {track.thumbnails?.map((thumb, i) => (
                              <div key={i} className={Styles.thumbnail}>
                                <img src={thumb} alt="" />
                              </div>
                            ))}
                            {track.keyframes?.map(keyframe => (
                              <div 
                                key={keyframe.id}
                                className={Styles.keyframe}
                                style={{ left: keyframe.time * 2 }}
                                title={keyframe.type}
                              />
                            ))}
                          </>
                        )}
                        {track.type === 'audio' && (
                          <div className={Styles.waveform}>
                            {track.waveform?.map((value, i) => (
                              <div 
                                key={i}
                                className={Styles.waveformBar}
                                style={{ height: `${value * 100}%` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Timeline;