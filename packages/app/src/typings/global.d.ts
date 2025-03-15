declare global {
  interface Window {
    AMap: any;
  }
}


declare namespace API {
  type BaseRes<T> = {
    code: number;
    msg: string;
    data: T;
  };
}