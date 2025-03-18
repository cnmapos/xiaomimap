import {
  createViewer,
  IViewer,
  LineEntity,
  PointEntity,
  PolygonEntity,
  HZViewer,
  EditorManager,
  Coordinate,
  IEntity,
} from "@hztx/core";
// import * as WKT from "wellknown";
import { useEffect, useRef, useMemo } from "react";
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
import GeometryStylePanel from "./GeometryStylePanel";
import Context from "./context";
import { useSearchParams } from "react-router-dom";
const noop = () => {};

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
  entityId: string;
  // viewer: IViewer;
  // entity?: IEntity;
  removeEntity?: () => void;
}

const Map: React.FC<{
  onSelectMode: (v: number) => void;
}> = (props) => {
  const [searchParams]= useSearchParams();
  const projectId = searchParams.get('projectId')
  const { onSelectMode } = props;
  const [fullscreen, setFullscreen] = useState(true);
  const editorManager = useRef<EditorManager | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: IViewer }>({ viewer: null });
  const [list, setList] = useState<PreviewListType[]>([]);
  const [loading, setLoading] = useState(false);

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

  function genEditorManager() {
    if (!editorManager.current) {
      editorManager.current = new EditorManager(context.current.viewer);
    }
    return editorManager.current;
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
      let entityId = "";
      let removeEntity = null;
      if (coordinates.length) {
        const raw = addEntity(
          ApiResGeometryType[item.geometryType] as CreateGeometryType,
          coordinates,
          false
        );
        entityId = raw?.entityId || "";
        removeEntity = raw?.removeEntity;
      }
      return {
        ...item,
        type: ApiResGeometryType[item.geometryType],
        showInMap: true,
        projectId,
        coordinates,
        entityId,
        removeEntity: removeEntity || noop,
      };
    });
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
    coordinates: Coordinate | Coordinate[],
    isCreate = true
  ) => {
    let entity = null;
    switch (type) {
      case GeometryType.Point:
        entity = new PointEntity({
          positions: coordinates as Coordinate,
        });
        break;
      case GeometryType.LineString:
        entity = new LineEntity({
          positions: coordinates as Coordinate[],
        });
        break;
      case GeometryType.Polygon:
        entity = new PolygonEntity({
          positions: coordinates as Coordinate[],
        });
        break;
      default:
        return;
    }
    if (!entity || !context.current.viewer) return;
    // 创建时geometry
    const geometry = isCreate
      ? {
          projectId,
          geometryType: type.toLocaleLowerCase(),
          geoData: WKT.stringify({
            type: GeometryType[type],
            coordinates: (type === GeometryType.Polygon
              ? [[...coordinates, coordinates[0]]]
              : coordinates) as GeoCoordinate,
          }),
          category: 1,
        }
      : null;

    context.current.viewer.addEntity(entity);
    // 重制编辑要素
    menuBarRef.current?.updateType(-1);

    // setTimeout(() => {
    //   context.current.viewer.entities.remove(entity);
    // }, 2000)
    return {
      geometry,
      entityId: entity.id,
      removeEntity: () => {
        console.log("removeEntity", context.current.viewer.entities, entity);
        context.current.viewer.entities.remove(entity);
      },
    };
  };
  // 确认新增要素
  const confirmAdd = async () => {
    return Modal.confirm({
      title: "确认新增要素？",
    });
  };

  const saveAsset = async (geometry: any) => {
    setLoading(true);
    const res = await saveProjectAsset({
      geometryList: [geometry],
    }).finally(() => {
      setLoading(false);
    });
    if (res.code === 0) {
      message.success("保存成功");
      init();
    } else {
      message.error(res.msg || "保存失败");
    }
    return res?.data;
  };

  const addPoint = () => {
    const manager = genEditorManager();
    const editor = manager.startCreate("point", {}, async (coordinates) => {
      const item = addEntity(GeometryType.Point, coordinates);
      if (item?.geometry) {
        await saveAsset({
          ...item?.geometry,
          geometryName: getNameIndex(GeometryType.Point),
        });
      }
    });
  };

  const addLine = () => {
    const manager = genEditorManager();
    manager.startCreate("line", {}, async (coordinates) => {
      console.log("draw line", coordinates);
      const item = addEntity(GeometryType.LineString, coordinates);
      if (item?.geometry) {
        await saveAsset({
          ...item?.geometry,
          geometryName: getNameIndex(GeometryType.LineString),
        });
      }
    });
  };
  const addPolygon = () => {
    const manager = genEditorManager();
    manager.startCreate("polygon", {}, async (coordinates) => {
      console.log("draw polygon", coordinates);
      const item = addEntity(GeometryType.Polygon, coordinates as Coordinate[]);
      if (item?.geometry) {
        await saveAsset({
          ...item?.geometry,
          geometryName: getNameIndex(GeometryType.Polygon),
        });
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
  const contextValue = useMemo(() => {
    return {
      viewer: null,
      updateGeoAsset: () => {
        // init();
      },
    };
  }, []);
  const resetMenuBar = () => {
    menuBarRef.current?.updateCollapsed(false);
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
        <Context.Provider value={contextValue}>
          <MapMenuBar
            list={list}
            ref={menuBarRef}
            onStartCreate={(type: CreateGeometryType) =>
              handleStartCreate(type)
            }
          ></MapMenuBar>
        </Context.Provider>

        <Search onSelect={handleSelect}></Search>
        <div className="absolute z-10 right-4 top-30">
          <GeometryStylePanel></GeometryStylePanel>
        </div>
        <MapControlBar
          fullscreen={fullscreen}
          onZoom={(type: "in" | "out", amount?: number) =>
            handleMapZoom(type, amount)
          }
          onBack={() => {
            setFullscreen(false);
            resetMenuBar();
            onSelectMode(-1);
          }}
          onFullscreen={(v) => {
            setFullscreen(v);
            if (!v) {
              resetMenuBar();
            }
          }}
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
