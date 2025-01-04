import { Cartesian3, ImageryProvider, Viewer, Math, ImageryLayer, Ion } from 'cesium';
import { Coordinate, HeadingPitchRoll, IViewer } from './types';

export class HZViewer implements IViewer {
    private viewer: Viewer;
    constructor(containerId: string) {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI';

        this.viewer = new Viewer(containerId, {
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false,
            creditContainer: document.createElement('div'),
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