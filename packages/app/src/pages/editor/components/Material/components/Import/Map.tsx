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
// import * as WKT from "wellknown";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import MapMenuBar from "./MapMenuBar";
import Search from "./MapSearch";
import MapControlBar from "./MapControlBar";
import { MapMenuBarRef } from "./MapMenuBar";
import { useState } from "react";
import { Modal, message, Spin } from "antd";
import {
  listProjectGeometry,
  listProjectAsset,
  saveProjectAsset,
  IGeometryAssetType,
} from "@/service/api/project";
import {
  Coordinate as GeoCoordinate,
  ApiResGeometryType,
  GeometryType,
  CreateGeometryType,
} from "@/typings/map";
import * as WKT from "@/utils/parseWkt";

export const GeometryCname = {
  [GeometryType.Point]: "点",
  [GeometryType.LineString]: "线",
  [GeometryType.Polygon]: "面",
  [GeometryType.GeometryCollection]: "集合要素",
};

export interface PreviewListType extends IGeometryAssetType {
  // name: string;
  type: CreateGeometryType;
  // id: number;
  showInMap?: boolean;
  projectId: number;
  collect?: boolean;
  coordinates: GeoCoordinate;
}

const Map: React.FC<{
  onSelectMode: (v: number) => void;
}> = (props) => {
  const { onSelectMode } = props;
  const [fullscreen, setFullscreen] = useState(true);
  const managerIns = useRef<EditorManager | null>(null);

  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: IViewer }>({ viewer: null });
  const [list, setList] = useState<PreviewListType[]>([]);
  const [loading, setLoading] = useState(false);

  const projectId = 1;
  const userId = 9;

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

  function editorManagerIns() {
    if (!managerIns.current) {
      managerIns.current = new EditorManager(context.current.viewer);
    }
    return managerIns.current;
  }
  const init = async () => {
    setLoading(true);
    const res = await listProjectGeometry({
      projectId,
      category: 1,
    }).finally(() => {
      setLoading(false);
    });
    const data = res?.data || [];
    const _data = data.map((item) => {
      const coordinates = WKT.parse(item.geoData) as any[];
      if (coordinates.length) {
        addEntity(
          ApiResGeometryType[item.geometryType] as CreateGeometryType,
          coordinates
        );
      }
      return {
        ...item,
        type: ApiResGeometryType[item.geometryType],
        showInMap: true,
        projectId,
        coordinates,
      };
    });
    console.log(_data);
    setList(_data);
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
  const getNameIndex = (type: CreateGeometryType) => {
    const i = list.filter((t) => t.type === type)?.length + 1;
    return `${GeometryCname[type]}${i}`;
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
    type: CreateGeometryType,
    coordinates: Coordinate | Coordinate[]
  ) => {
    let entity = null;
    if (type === GeometryType.Point) {
      entity = new PointEntity({
        positions: coordinates as Coordinate,
      });
    }
    if (type === GeometryType.LineString) {
      entity = new LineEntity({
        positions: coordinates as Coordinate[],
      });
    }
    if (type === GeometryType.Polygon) {
      entity = new PolygonEntity({
        positions: coordinates as Coordinate[],
      });
    }
    if (!entity || !context.current.viewer) return;

    const geometry = {
      // geometryName: getNameIndex(type),
      projectId,
      geometryType: type.toLocaleLowerCase(),
      geoData: WKT.stringify({
        type: GeometryType[type],
        coordinates: (type === GeometryType.Polygon
          ? [[...coordinates, coordinates[0]]]
          : coordinates) as GeoCoordinate,
      }),
      category: 1,
    };

    context.current.viewer.addEntity(entity);
    menuBarRef.current?.updateType(-1);
    return geometry;
  };
  // 确认新增要素
  const confirmAdd = async () => {
    return Modal.confirm({
      title: "确认新增要素？",
    })
  }

  const saveAsset = async (geometry: any) => {
    setLoading(true);
    const res = await saveProjectAsset({
      geometryList: [geometry],
    }).finally(() => {
      setLoading(false);
    });
    if (res.code === 0) {
      message.success("保存成功");
    } else {
      message.error(res.msg || "保存失败");
    }
    return res?.data;
  };

  const addPoint = () => {
    const manager = editorManagerIns();
    const editor = manager.startCreate("point", {}, async (coordinates) => {
      console.log("point", editor, coordinates);
      const geometry = addEntity(GeometryType.Point, coordinates);
      if (geometry) {
        await saveAsset({
          ...geometry,
          geometryName: getNameIndex(GeometryType.Point),
        });
        // setList([...list, item]);
      }
    });
  };

  const addLine = () => {
    const manager = editorManagerIns();
    manager.startCreate("line", {}, async (coordinates) => {
      console.log("draw line", coordinates);
      const geometry = addEntity(GeometryType.LineString, coordinates);
      if (geometry) {
        await saveAsset({
          ...geometry,
          geometryName: getNameIndex(GeometryType.LineString),
        });
        // setList([...list, item]);
      }
    });
  };
  const addPolygon = () => {
    const manager = editorManagerIns();
    manager.startCreate("polygon", {}, async (coordinates) => {
      console.log("draw polygon", coordinates);
      const geometry = addEntity(
        GeometryType.Polygon,
        coordinates as Coordinate[]
      );
      if (geometry) {
        await saveAsset({
          ...geometry,
          geometryName: getNameIndex(GeometryType.Polygon),
        });
        // setList([...list, item]);
      }
    });
  };
  const handleStartCreate = (type: CreateGeometryType) => {
    if (type === GeometryType.Point) {
      addPoint();
    }
    if (type === GeometryType.LineString) {
      addLine();
    }
    if (type === GeometryType.Polygon) {
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
      <Spin spinning={loading} wrapperClassName="!w-full !h-full map-spin">
        <MapMenuBar
          list={list}
          ref={menuBarRef}
          onStartCreate={(type: CreateGeometryType) => handleStartCreate(type)}
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
      </Spin>
    </div>
  );
};

export default Map;
