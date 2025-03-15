export enum GeometryType {
  Point = "Point",
  LineString = "LineString",
  Polygon = "Polygon",
  GeometryCollection = "GeometryCollection"
}
  // GeometryCollection = "GeometryCollection"
// export type GeometryCollection = 

export interface IGeometry {
  type: keyof typeof GeometryType;
  coordinates: Coordinate;
}

export enum ApiResGeometryType {
  point = "Point",
  linestring = "LineString",
  polygon = "Polygon",
  geometry_collection = 'GeometryCollection'
}

/**
 * 
集合几何 GEOMETRYCOLLECTION

 GEOMETRYCOLLECTION(
  POINT(1 1),
  LINESTRING(0 0, 1 1, 2 2),
  POLYGON((0 0, 1 1, 1 0, 0 0))
);
*/
// export const GeometryCollectionType = 'geometry_collection';

// "GeometryCollection"


export type CreateGeometryType = keyof typeof GeometryType;

// 定义geo Coordinate
export type Coordinate = number[] | number[][] | number[][][];