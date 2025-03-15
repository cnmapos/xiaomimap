//想嗦坐标
export type Point = [number, number, number?];
// 地理坐标，经纬高
export type Position = [number, number, number?];

export interface CoreEvent {
  pixel: Point;
  position: Position;
}

export interface ClickEvent extends CoreEvent {}

export type Dispatch = (type: string, data?: any) => void;

export interface Behavior {}
