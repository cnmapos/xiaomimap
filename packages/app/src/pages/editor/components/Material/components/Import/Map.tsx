import {
  createViewer,
  IViewer,
  LineEntity,
  PointEntity,
  PolygonEntity,
  HZViewer,
  EventTypes,
  EditorManager,
  Coordinate,
  IEntity,
  Style,
  BillboardEntity,
} from "@hztx/core";
// import * as WKT from "wellknown";
import React, { useEffect, useRef, useMemo, useCallback } from "react";
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
  entityHighlightStyle,
  entityDefaultStyle,
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
  entity?: IEntity;
  // entityRawStyle: Style;
  removeEntity?: () => void;
  flyToEntity?: () => void;
}

const Map: React.FC<{
  onSelectMode: (v: number) => void;
}> = React.memo((props) => {
  const [searchParams] = useSearchParams();
  const projectId = Number(searchParams.get("projectId"));
  const { onSelectMode } = props;
  const [fullscreen, setFullscreen] = useState(true);
  const editorManager = useRef<EditorManager | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const context = useRef<{ viewer: IViewer; entities: IEntity[] }>({
    viewer: null,
    entities: [],
  });
  const [list, setList] = useState<PreviewListType[]>([]);
  const [loading, setLoading] = useState(false);
  // 当前样式面板类型
  const [stylePanelType, setStylePanelType] = useState<GeometryType | null>(
    null
  );

  // 当前选中的要素
  const [selectedEntity, setSelectedEntity] = useState<IEntity | null>(null);
  const [selectedEntityStyle, setSelectedEntityStyle] = useState<Style>({});
  const [selectedSelectedGeometry, setSelectedSelectedGeometry] =
    useState<PreviewListType>();
  // 当前选中的要素样式
  // const selectedEntityStyle = useRef<Style | null>(null);
  // const [, setSelectedEntity] = useState<IEntity | null>(null);

  const poiEntity = useRef<PointEntity>();

  const menuBarRef = useRef<MapMenuBarRef>(null);
  useEffect(() => {
    const viewer = createViewer(container.current!, {
      key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI",
    });
    viewer.setView([116.397477, 39.908692, 800000], {
      heading: 0,
      pitch: -90,
      roll: 0,
    });
    context.current.viewer = viewer;
    // 把默认的要素数据添加到地图
    init(viewer, true);
    return () => {
      viewer?.destroy();
    };
  }, []);
  const handleLeftClick = useCallback(
    (e) => {
      const entity = e.entities?.[0] as IEntity;
      const geometryType = getGeometryType(entity);
      // 重制上一次的要素样式
      const prevGeometry = list.find(
        (item) => item.entityId === selectedEntity?.id
      );
      const prevEntityStyle = prevGeometry?.entity?.getStyle();
      if (selectedEntity && prevEntityStyle) {
        setGeometryStyle(selectedEntity, prevEntityStyle);
      }
      // 选中要素的id

      if (!geometryType) {
        setStylePanelType(null);
        setSelectedEntity(null);
        return;
      }
      const geometry = list?.find((item) => item.entityId === entity.id);
      setSelectedSelectedGeometry(geometry);
      // 获取当前要素的样式在面板使用
      const entityStyle = entity?.getStyle();
      setSelectedEntityStyle(entityStyle);

      // 如果当前选中和上一次的一样，则取消选中
      if (selectedEntity && selectedEntity.id === entity.id) {
        setStylePanelType(null);
        setSelectedEntity(null);
        return;
      }

      setStylePanelType(geometryType);
      // 选中要素
      setSelectedEntity(entity);

      // 高亮
      setGeometryStyle(entity, entityHighlightStyle[geometryType]);
    },
    [list, selectedEntity]
  );

  useEffect(() => {
    if (!context.current.viewer) return;

    context.current.viewer?.on(EventTypes.LEFT_CLICK, handleLeftClick);
    return () => {
      context.current.viewer?.off(EventTypes.LEFT_CLICK, handleLeftClick);
    };
  }, [context.current.viewer, handleLeftClick, list]);

  useEffect(() => {
    if (selectedEntity) {
      setStylePanelType(getGeometryType(selectedEntity));
    }
  }, [selectedEntity]);

  // 根据entity 实例 类型获取几何类型
  const getGeometryType = (entity: IEntity) => {
    if (entity instanceof PointEntity) {
      return GeometryType.Point;
    }
    if (entity instanceof LineEntity) {
      return GeometryType.LineString;
    }
    if (entity instanceof PolygonEntity) {
      return GeometryType.Polygon;
    }
    return null;
  };

  // 设置几何要素样式
  const setGeometryStyle = (entity: IEntity, style: Style) => {
    if (!entity) return;
    entity.setStyle(style);
  };

  const updateSelectedEntityStyle = (style: Style) => {
    selectedEntity?.setStyle(style);
    // const entityStyle = selectedEntity?.getStyle();
    // if(entityStyle){
    //   setSelectedEntityStyle(entityStyle);
    // }
  };
  function genEditorManager() {
    if (!context.current.viewer) return null;
    if (!editorManager.current) {
      editorManager.current = new EditorManager(context.current.viewer);
    }
    return editorManager.current;
  }
  const init = async (viewer: IViewer, isInit = false) => {
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
      let flyToEntity = null;
      // let entityRawStyle = null;
      let entity = null;
      const style = item.geometryJson?.style || {};
      if (coordinates.length) {
        const raw = addEntity(
          viewer,
          ApiResGeometryType[item.geometryType] as CreateGeometryType,
          coordinates,
          false,
          style
        );
        entityId = raw?.entityId || "";
        removeEntity = raw?.removeEntity;
        flyToEntity = raw?.flyToEntity;
        // entityRawStyle = raw?.entityRawStyle;
        entity = raw?.entity;
      }
      return {
        ...item,
        type: ApiResGeometryType[item.geometryType],
        showInMap: true,
        projectId,
        coordinates,
        entityId,
        removeEntity: removeEntity || noop,
        flyToEntity: flyToEntity || noop,
        // entityRawStyle,
        entity,
      };
    });
    if (!list.length && _data.length && isInit) {
      setTimeout(() => {
        flyToEntities(context.current.entities);
      }, 300);
    }
    setList(_data);
  };

  const flyToEntities = (entities: IEntity[]) => {
    context.current.viewer?.flyToEntities({
      entities,
    });
  };

  const setViewWithZoom = (posi) => {
    context.current.viewer?.setView([posi.lng, posi.lat, 10000], {
      heading: 0,
      pitch: -90,
      roll: 0,
    });
  };

  const handleSelect = ({ location, name, type }: any) => {
    setViewWithZoom(location);
    if (poiEntity.current) {
      context.current.viewer.removeEntity(poiEntity.current);
    }
    poiEntity.current = new BillboardEntity({
      positions: [location.lng, location.lat],
      width: 48,
      height: 48,
      image: "assets/geos/locate.png",
    });
    context.current.viewer.addEntity(poiEntity.current);

    // TODO: 显示POI信息面板
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
    viewer: IViewer,
    type: CreateGeometryType,
    coordinates: Coordinate | Coordinate[],
    isCreate = true,
    style?: Style
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
    if (!entity || !viewer) return;
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
    if (style) {
      entity.setStyle(style);
    }
    setTimeout(() => {
      viewer.addEntity(entity);
    }, 100);
    // 重制编辑要素
    menuBarRef.current?.updateType(-1);
    // 添加到地图
    context.current.entities.push(entity);
    return {
      geometry,
      entityId: entity.id,
      entity,
      // entityRawStyle: entity.getStyle(),
      flyToEntity: () => {
        flyToEntities([entity]);
      },
      removeEntity: () => {
        context.current.viewer.entities.remove(entity);
      },
    };
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
      init(context.current.viewer);
    } else {
      message.error(res.msg || "保存失败");
    }
    return res?.data;
  };

  const addPoint = () => {
    const manager = genEditorManager();
    if (!manager) return;
    const editor = manager.startCreate("point", {}, async (coordinates) => {
      const item = addEntity(
        context.current.viewer,
        GeometryType.Point,
        coordinates,
        false,
        {}
      );
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
    if (!manager) return;
    manager.startCreate("line", { smooth: true }, async (coordinates) => {
      console.log("draw line", coordinates);
      const item = addEntity(
        context.current.viewer,
        GeometryType.LineString,
        coordinates,
        false,
        {}
      );
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
    if (!manager) return;
    manager.startCreate("polygon", {}, async (coordinates) => {
      console.log("draw polygon", coordinates);
      const item = addEntity(
        context.current.viewer,
        GeometryType.Polygon,
        coordinates as Coordinate[],
        false,
        {}
      );
      if (item?.geometry) {
        await saveAsset({
          ...item?.geometry,
          geometryName: getNameIndex(GeometryType.Polygon),
        });
      }
    });
  };
  const handleStartCreate = useCallback((type: CreateGeometryType) => {
    if (type === GeometryType.Point) {
      addPoint();
    }
    if (type === GeometryType.LineString) {
      addLine();
    }
    if (type === GeometryType.Polygon) {
      addPolygon();
    }
  }, []);
  const contextValue = useMemo(() => {
    return {
      viewer: null,
      updateGeoAsset: () => {
        // init(context.current.viewer);
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
            onStartCreate={handleStartCreate}
          ></MapMenuBar>
        </Context.Provider>

        <Search onSelect={handleSelect}></Search>
        <div className="absolute z-10 right-4 top-30">
          {stylePanelType && (
            <GeometryStylePanel
              updateEntityStyle={updateSelectedEntityStyle}
              geometry={selectedSelectedGeometry}
              entityStyle={selectedEntityStyle}
              type={stylePanelType}
            />
          )}
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
});

export default Map;
