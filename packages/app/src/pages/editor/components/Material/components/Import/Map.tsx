import { createViewer, HZViewer } from "@hztx/core";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import MapMenuBar from "./MapMenuBar";
import Search from "./MapSearch";
import { useState } from "react";

const Map: React.FC = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: HZViewer | null }>({ viewer: null });
  useEffect(() => {
    const viewer = createViewer(container.current!, {
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI",
    });
    context.current.viewer = viewer;
    return () => {
      viewer?.destroy();
    };
  }, []);
  return (
    <div
      className={classNames(
        "bg-editor-card text-white absolute w-full h-full",
        {
          "fixed top-0 left-0 right-0 bottom-0 z-10": fullscreen,
        }
      )}
    >
      <MapMenuBar></MapMenuBar>
      <Search></Search>
      <div
        ref={(e) => (container.current = e)}
        className="map h-full w-full"
      ></div>
    </div>
  );
};

export default Map;
