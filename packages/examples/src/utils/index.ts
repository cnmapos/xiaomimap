import { Cartesian2, Cartographic, defined, Math as CMath } from "cesium";

export const pixel2Coordinates = (viewer: any, x: number, y: number) => {
    const screenWidth = viewer.scene.canvas.clientWidth;
    const screenHeight = viewer.scene.canvas.clientHeight;
    const startPixel = new Cartesian2(screenWidth / 2, screenHeight / 2); // 屏幕中心
    const endPixel = new Cartesian2(startPixel.x + x, startPixel.y + y); // 向右 100 像素

    // 将像素坐标转换为世界坐标
    const startWorldPos = viewer.scene.globe.pick(viewer.camera.getPickRay(startPixel)!, viewer.scene);
    const endWorldPos = viewer.scene.globe.pick(viewer.camera.getPickRay(endPixel)!, viewer.scene);

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