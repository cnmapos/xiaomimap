import { Cartesian2, Cartographic, defined, Math as CMath, Viewer, Cartesian3, PolylinePolygonMaterialProperty, Color, Entity, CallbackProperty } from "cesium";
import { IPlayer } from "../../types";

type PolygonOptions = {
    color?: string;
    width?: number;
    offset?: number;
    offsetX?: number;
    offsetY?: number;
    offsetHeight?: number;
    frameRate?: number;
    alongTrack?: boolean;
}

export class PolygonPlayer implements IPlayer {
    private offset: number;
    private offsetX: number;
    private offsetY: number;
    private offsetHeight: number;
    private entity: Entity;
    private pausing: boolean;
    private frameRate: number;
    private alongTrack: boolean;

    constructor(private viewer: Viewer, private coordinates: any[], options?: PolygonOptions) {
        const { 
            color = '#00F', 
            width = 10,
            offset = 0,
            offsetX = 0,
            offsetY = 0,
            offsetHeight = 0,
            frameRate = 15,
            alongTrack = false,
        } = options || ({} as PolygonOptions);
        this.pausing = true;
        this.offset = offset;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetHeight = offsetHeight;
        this.frameRate = frameRate;
        this.alongTrack = alongTrack;

        this.entity = this.viewer.entities.add({
            name: "Polygon",
            polyline: {
                width,
                positions: Cartesian3.fromDegreesArrayHeights(this.coordinates.flat()),
                material: new PolylinePolygonMaterialProperty(Color.fromCssColorString(color)),
            },
            // clampToGround: true,
        });
    }

    play() {
        this.pausing = false;
    }
    pause() {
        this.pausing = true;
    }
    replay() {
        if (this.entity.polyline) {
            this.entity.polyline.positions = this.getCallbackProperty();
        }
        this.play();
    }

    private pixelToCoordinates(x: number, y: number) {
        const screenWidth = this.viewer.scene.canvas.clientWidth;
        const screenHeight = this.viewer.scene.canvas.clientHeight;
        const startPixel = new Cartesian2(screenWidth / 2, screenHeight / 2); // 屏幕中心
        const endPixel = new Cartesian2(startPixel.x + x, startPixel.y + y); // 向右 100 像素

        // 将像素坐标转换为世界坐标
        const startWorldPos = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(startPixel)!, this.viewer.scene);
        const endWorldPos = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(endPixel)!, this.viewer.scene);

        if (defined(startWorldPos) && defined(endWorldPos)) {
            // 将世界坐标转换为经纬度
            const startCartographic = Cartographic.fromCartesian(startWorldPos);
            const endCartographic = Cartographic.fromCartesian(endWorldPos);

            // 计算经纬度差值（以弧度表示）
            const lonDiff = endCartographic.longitude - startCartographic.longitude;
            const latDiff = endCartographic.latitude - startCartographic.latitude;

            // 将弧度转换为度数
            const lng = CMath.toDegrees(lonDiff);
            const lat = CMath.toDegrees(latDiff);

            return { lng, lat }
        }
    }

    private getCallbackProperty() {
        const firstPos = this.coordinates[0], lastPos = this.coordinates[this.coordinates.length - 1];
        const PolygonDir = Cartesian3.subtract(Cartesian3.fromDegrees(...firstPos), Cartesian3.fromDegrees(...lastPos), new Cartesian3());
        const angle = Math.atan2(PolygonDir.y, PolygonDir.x);

        const { lng: length } = this.pixelToCoordinates(this.offset, 0)!;

        const buffer = this.alongTrack ? ({
            lng: length * Math.cos(angle), 
            lat: length * Math.sin(angle),
        }) : this.pixelToCoordinates(this.offsetX, this.offsetY)!;
        let direction = 1, value = 0;

       return new CallbackProperty((e, result) => {
            if (!this.pausing) {
                value = (value + direction) % (this.frameRate * 2);
                if (value === 0 || value === this.frameRate) {
                    direction *= -1; // 反转方向
                }                
            }

            const offset = { 
                lng: value < this.frameRate ? value * buffer.lng / this.frameRate : (this.frameRate * 2 - value) * buffer.lng / this.frameRate , 
                lat:  value < this.frameRate ? value * buffer.lat / this.frameRate : (this.frameRate * 2 - value) * buffer.lat / this.frameRate,
                height:  value < this.frameRate ? value * this.offsetHeight / this.frameRate : (this.frameRate * 2 - value) * this.offsetHeight / this.frameRate,
            }; // 根据value计算offset
            return Cartesian3.fromDegreesArrayHeights(this.coordinates.map((c) => [c[0] + offset.lng, c[1] + offset.lat, c[2] + offset.height]).flat());
        }, false);
    }
    
}