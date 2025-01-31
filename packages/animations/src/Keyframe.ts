export class Keyframe {
  time: number;
  value: any;
  constructor(time: number, value: any) {
    this.time = time; // 时间戳（毫秒）
    this.value = value; // 属性值
  }
}
