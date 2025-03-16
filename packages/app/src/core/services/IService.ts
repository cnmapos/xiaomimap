import { Args } from "../types";

export interface IService {
  id: string;
  // 服务可以提供多个方法
  [key: string]: Args | ((...args: Args[]) => any);
}
