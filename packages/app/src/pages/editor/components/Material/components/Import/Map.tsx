import {
  createViewer,
  IViewer,
  LineEntity,
  PointEntity,
  PolygonEntity,
  HZViewer,
  EditorManager,
  Coordinate,
} from "@hztx/core";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import MapMenuBar from "./MapMenuBar";
import Search from "./MapSearch";
import MapControlBar from "./MapControlBar";
import { MapMenuBarRef } from "./MapMenuBar";
import { useState } from "react";
import { Button, Spin } from "antd";

export type CreateType = "point" | "line" | "polygon";
// export type GeometryType<T extends CreateType> = T extends "point"
//   ? Coordinate
//   : Coordinate[];

export interface PreviewListType {
  name: string;
  type: CreateType;
  id: number;
  showInMap?: boolean;
  collect?: boolean;
  coordinates: Coordinate | Coordinate[];
}

const Map: React.FC<{
  onSelectMode: (v: number) => void;
}> = (props) => {
  const { onSelectMode } = props;
  const [fullscreen, setFullscreen] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: IViewer }>({ viewer: null });
  const [list, setList] = useState<PreviewListType[]>([]);
  const [loading, setLoading] = useState(true);

  const menuBarRef = useRef<MapMenuBarRef>(null);
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
    // 把默认的要素数据添加到地图
    init();
    return () => {
      viewer?.destroy();
    };
  }, []);

  const init = () => {
    const data = [
      {
        name: "历史点1",
        type: "point",
        id: 2,
        showInMap: true,
        coordinates: [116.397477, 39.908692],
      },
      {
        name: "历史线1",
        type: "line",
        id: 1,
        showInMap: true,
        coordinates: [
          [116.76283528817973, 42.40737146196385],
          [117.03069047221693, 41.39360834053855],
          [118.99044918425696, 41.4253323858586],
        ],
      },
    ] as PreviewListType[];
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setList(data);
    data.forEach((item) => {
      addEntity(item.type, item.coordinates);
    });
  };
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
  const getNameIndex = (type: CreateType) => {
    const i = list.filter((t) => t.type === type)?.length + 1;
    const obj = {
      point: "点",
      line: "线",
      polygon: "面",
    };
    return `${obj[type]}${i}`;
  };
  const handleMapZoom = (type: "in" | "out", amount?: number) => {
    if (type === "out") {
      context.current.viewer?.zoomOut(amount);
    }
    if (type === "in") {
      context.current.viewer?.zoomIn(amount);
    }
  };
  const addEntity = (
    type: CreateType,
    coordinates: Coordinate | Coordinate[]
  ) => {
    let entity = null;
    if (type === "point") {
      entity = new PointEntity({
        positions: coordinates as Coordinate,
      });
    }
    if (type === "line") {
      entity = new LineEntity({
        positions: coordinates as Coordinate[],
      });
    }
    if (type === "polygon") {
      entity = new PolygonEntity({
        positions: coordinates as Coordinate[],
      });
    }
    if (!entity || !context.current.viewer) return;
    context.current.viewer.addEntity(entity);
    menuBarRef.current?.updateType(-1);
    return {
      id: Date.now(),
      name: getNameIndex(type),
      showInMap: true,
      type: type,
      coordinates,
    };
  };

  const addPoint = () => {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate("point", {}, (coordinates) => {
      console.log("point", coordinates);
      const item = addEntity("point", coordinates);
      if (item) {
        setList([...list, item]);
      }
    });
  };

  const addLine = () => {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate("line", {}, (coordinates) => {
      console.log("draw line", coordinates);
      const item = addEntity("line", coordinates);
      if (item) {
        setList([...list, item]);
      }
    });
  };
  const addPolygon = () => {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate("polygon", {}, (coordinates) => {
      console.log("draw polygon", coordinates);
      const item = addEntity("polygon", coordinates);
      if (item) {
        setList([...list, item]);
      }
    });
  };
  const handleStartCreate = (type: CreateType) => {
    if (type === "point") {
      addPoint();
    }
    if (type === "line") {
      addLine();
    }
    if (type === "polygon") {
      addPolygon();
    }
  };
  return (
    <div
      className={classNames(
        "bg-editor-card text-white absolute w-full h-full",
        {
          "fixed top-0 left-0 right-0 bottom-0 z-10": fullscreen,
        }
      )}
    >
      <MapMenuBar
        list={list}
        ref={menuBarRef}
        onStartCreate={(type: CreateType) => handleStartCreate(type)}
      ></MapMenuBar>
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
