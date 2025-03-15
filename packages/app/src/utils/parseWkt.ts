import * as WKT from "wellknown";
import { Coordinate, IGeometry, CreateGeometryType, GeometryType } from "@/typings/map";

// export interface GeoType {
//   type: CreateGeometryType,
//   coordinates: Coordinate,
// }
export const parse = (wkt: string): Coordinate | IGeometry[] => {
  try {
    const geo = WKT.parse(wkt);
    if(geo.type === GeometryType.Polygon){
      // 取出想要的格式
      return geo.coordinates[0].slice(0, -1);
    }
    return (geo.coordinates || geo?.geometries) as (Coordinate | IGeometry[]);
  } catch (error) {
    console.log(wkt, error);
    return [];
  }
}

export const stringify = (geo: IGeometry): string => {
  return WKT.stringify(geo);
}