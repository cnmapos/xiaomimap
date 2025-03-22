import { Coordinate } from "@hztx/core";

export type Arg = string | number | boolean | object | null | undefined;

export enum ServiceIds {
  STATE = "state",
}

export type TraceAnimationCommandArg = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: Coordinate[]
  },
  properties: {
    geometryId: number,
  }
}