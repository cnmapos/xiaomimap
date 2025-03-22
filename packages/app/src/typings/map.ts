export enum GeometryType {
  Point = "Point",
  LineString = "LineString",
  Polygon = "Polygon",
  GeometryCollection = "GeometryCollection",
}
export interface IGeometry {
  type: keyof typeof GeometryType;
  coordinates: Coordinate;
}

export enum ApiResGeometryType {
  point = "Point",
  linestring = "LineString",
  polygon = "Polygon",
  geometry_collection = "GeometryCollection",
}

export enum GeometryActionType {
  // 属性 删除 应用到动画 生成轨迹动画 生成集合要素
  Property = "Property",
  Delete = "Delete",
  ApplyAnimation = "ApplyAnimation",
  GenerateTrailAnimation = "GenerateTrailAnimation",
  GenerateCollection = "GenerateCollection",
}

export type CreateGeometryType = keyof typeof GeometryType;

// 定义geo Coordinate
export type Coordinate = number[] | number[][] | number[][][];


// 高亮样式
export const  entityHighlightStyle =  {
  [GeometryType.Point]: {
    color: "#00b9c4",
    pixelSize:10,
    outlineColor:'#fff',
    outlineWidth:2
  },
  [GeometryType.LineString]: {
    color: "#00b9c4",
    width:2,
  },
  [GeometryType.Polygon]: {
    color: "#00b9c4",
    outlineColor:"#fff",
    outlineWidth:2
  },
  
}
