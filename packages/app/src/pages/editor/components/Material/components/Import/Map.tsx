import { createViewer, HZViewer, EditorManager } from "@hztx/core";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import MapMenuBar from "./MapMenuBar";
import Search from "./MapSearch";
import MapControlBar from "./MapControlBar";
import { useState } from "react";
import { Button } from "antd";

export type  CreateType = 'point' | 'line' | 'polygon';

 
const Map: React.FC<{
  onSelectMode: (v: number) => void;
}> = (props) => {
  const { onSelectMode } = props;
  const [fullscreen, setFullscreen] = useState(true);
  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: HZViewer | null }>({ viewer: null });
  useEffect(() => {
    const viewer = createViewer(container.current!, {
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI",
    });
    viewer.setView([116.397477, 39.908692, 909000], {
      heading: 0,
      pitch: -90,
      roll: 0,
    });
    context.current.viewer = viewer;
    return () => {
      viewer?.destroy();
    };
  }, []);

  const setViewWithZoom = (posi) => {
    context.current.viewer?.setView([posi.lng, posi.lat, 10000], {
      heading: 0,
      pitch: -90,
      roll: 0,
    });
  };

  const handleSelect = ({ location }: any) => {
    setViewWithZoom(location);
  };
  const handleMapZoom = (type: "in" | "out", amount?: number) => {
    if (type === "out") {
      context.current.viewer?.zoomOut(amount);
    }
    if (type === "in") {
      context.current.viewer?.zoomIn(amount);
    }
  };

  const handleStartCreate = (type:CreateType) => {
   
  }
  const addPoint =  () =>  {
    const manager = new EditorManager(context.current.viewer._viewer);
    manager.startCreate('point', {}, (coordinates) => {
      console.log('point', coordinates);
    });
  }

  return (
    <div
      className={classNames(
        "bg-editor-card text-white absolute w-full h-full",
        {
          "fixed top-0 left-0 right-0 bottom-0 z-10": fullscreen,
        }
      )}
    >
      <MapMenuBar onStartCreate={(type:CreateType) => handleStartCreate(type)}></MapMenuBar>
      <Search onSelect={handleSelect}></Search>
      <MapControlBar
        fullscreen={fullscreen}
        onZoom={(type: "in" | "out", amount?: number) =>
          handleMapZoom(type, amount)
        }
        onBack={() => {
          setFullscreen(false);
          onSelectMode(-1);
        }}
        onFullscreen={(v) => setFullscreen(v)}
      ></MapControlBar>
      <div
        ref={(e) => (container.current = e)}
        className="map h-full w-full"
      ></div>
    </div>
  );
};

export default Map;
