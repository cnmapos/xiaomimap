import { createViewer, HZViewer } from "@hztx/core";
import { useEffect, useRef } from "react";
import { Cartesian3, Math as CMath } from "cesium";
import classNames from "classnames";
import MapMenuBar from "./MapMenuBar";
import Search from "./MapSearch";
import { useState } from "react";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
  PlusOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

const Main: React.FC<{
  fullscreen: boolean;
  onBack: () => void;
  onFullscreen: (v: boolean) => void;
  onZoom: (type: "in" | "out", amount?: number) => void;
}> = (props) => {
  const { onBack, onFullscreen, fullscreen } = props;
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="flex flex-col gap-2 text-sm text-center">
        <span
          onClick={onBack}
          className="px-1.5 py-1 cursor-pointer bg-black/60 mb-6 rounded-sm"
        >
          <RollbackOutlined />
        </span>
        <span
          onClick={() => onFullscreen(!fullscreen)}
          className="px-1.5 py-1 cursor-pointer bg-black/60 rounded-sm"
        >
          {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </span>
        <span
          onClick={() => props.onZoom("in")}
          className="px-1.5 py-1 cursor-pointer  bg-black/60 rounded-sm"
        >
          <PlusOutlined />
        </span>
        <span
          onClick={() => props.onZoom("out")}
          className="px-1.5 py-1 cursor-pointer  bg-black/60 rounded-sm"
        >
          <MinusOutlined />
        </span>
      </div>
    </div>
  );
};

export default Main;
