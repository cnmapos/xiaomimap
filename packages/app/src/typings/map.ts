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
