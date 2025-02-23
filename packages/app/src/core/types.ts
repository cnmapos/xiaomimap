export type Arg = string | number | boolean | object | null | undefined;

export enum ServiceIds {
  STATE = "state",
}

export interface AniKeyframe {
  start: number;
  end: number;
}
