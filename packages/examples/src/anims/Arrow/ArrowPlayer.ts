import { Cartesian2, Cartographic, defined, Math as CMath, Viewer, Cartesian3, PolylineArrowMaterialProperty, Color, Entity, CallbackProperty } from "cesium";
import { IPlayer } from "../../types";
import { pixel2Coordinates } from "../../utils";

type ArrowOptions = {
    color?: string;
    width?: number;
    offset?: number;
    offsetX?: number;
    offsetY?: number;
    offsetHeight?: number;
    frameRate?: number;
    alongTrack?: boolean;
}

export class ArrowPlayer implements IPlayer {
    private offset: number;
    private offsetX: number;
    private offsetY: number;
    private offsetHeight: number;
    private entity: Entity;
    private pausing: boolean;
    private frameRate: number;
    private alongTrack: boolean;

    constructor(private viewer: Viewer, private coordinates: any[], options?: ArrowOptions) {
        const { 
            color = '#00F', 
            width = 10,
            offset = 0,
            offsetX = 0,
            offsetY = 0,
            offsetHeight = 0,
            frameRate = 15,
            alongTrack = false,
        } = options || ({} as ArrowOptions);
        this.pausing = true;
        this.offset = offset;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetHeight = offsetHeight;
        this.frameRate = frameRate;
        this.alongTrack = alongTrack;

        this.entity = this.viewer.entities.add({
            name: "arrow",
            polyline: {
                width,
                positions: Cartesian3.fromDegreesArrayHeights(this.coordinates.flat()),
                material: new PolylineArrowMaterialProperty(Color.fromCssColorString(color)),
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

    private getCallbackProperty() {
        const firstPos = this.coordinates[0], lastPos = this.coordinates[this.coordinates.length - 1];
        const arrowDir = Cartesian3.subtract(Cartesian3.fromDegrees(...firstPos), Cartesian3.fromDegrees(...lastPos), new Cartesian3());
        const angle = Math.atan2(arrowDir.y, arrowDir.x);

        const { lng: length } = pixel2Coordinates(this.viewer, this.offset, 0)!;

        const buffer = this.alongTrack ? ({
            lng: length * Math.cos(angle), 
            lat: length * Math.sin(angle),
        }) : pixel2Coordinates(this.viewer, this.offsetX, this.offsetY)!;
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