import { Cartesian3, ImageryProvider, Viewer, Math, ImageryLayer } from 'cesium';
import { Coordinate, HeadingPitchRoll } from './types';

export class HZViewer {
    private viewer: Viewer;
    constructor(containerId: string) {
        this.viewer = new Viewer(containerId, {
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false
        });
    }

    // 封装添加图层的方法
    addImageryLayer(layer: ImageryProvider) {
        this.viewer.imageryLayers.addImageryProvider(layer);
    }

    // 封装设置视角的方法
    setView(position: Coordinate, orientation: HeadingPitchRoll) {
        this.viewer.camera.setView({
            destination: Cartesian3.fromDegrees(position.lng, position.lat, position.height),
            orientation: {
                heading: Math.toRadians(orientation.heading),
                pitch: Math.toRadians(orientation.pitch),
                roll: Math.toRadians(orientation.roll)
            }
        });
    }

    // 封装移除图层的方法
    removeImageryLayer(layer: ImageryLayer) {
        this.viewer.imageryLayers.remove(layer);
    }

    destroy() {
        this.viewer.destroy();
    }
}