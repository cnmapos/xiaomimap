import { Cartesian3 } from 'cesium';

/**
 * 线性插值（Lerp）
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值比例（0 到 1）
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

/**
 * 计算两个地理坐标点之间的距离
 * @param {number[]} coord1 - 第一个坐标点 [lon1, lat1, alt1]
 * @param {number[]} coord2 - 第二个坐标点 [lon2, lat2, alt2]
 * @returns {number} 两点之间的距离（单位：米）
 */
function calculateDistance(coord1, coord2) {
    // 将地理坐标转换为 Cesium.Cartesian3
    const position1 = Cartesian3.fromDegrees(coord1[0], coord1[1], coord1[2]);
    const position2 = Cartesian3.fromDegrees(coord2[0], coord2[1], coord2[2]);

    // 计算两点之间的直线距离
    const distance = Cartesian3.distance(position1, position2);

    return distance;
}

/**
 * 计算坐标列表中所有相邻点之间的总距离
 * @param {number[][]} coordinates - 坐标列表 [[lon1, lat1, alt1], [lon2, lat2, alt2], ...]
 * @returns {number} 总距离（单位：米）
 */
function calculateTotalDistance(coordinates) {
    if (coordinates.length < 2) {
        throw new Error('至少需要两个坐标点');
    }

    let totalDistance = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const coord1 = coordinates[i];
        const coord2 = coordinates[i + 1];

        // 将地理坐标转换为 Cesium.Cartesian3
        const position1 = Cartesian3.fromDegrees(coord1[0], coord1[1], coord1[2]);
        const position2 = Cartesian3.fromDegrees(coord2[0], coord2[1], coord2[2]);

        // 计算两点之间的距离
        const distance = Cartesian3.distance(position1, position2);

        // 累加距离
        totalDistance += distance;
    }

    return totalDistance;
}

/**
 * 球面线性插值（Slerp）
 * @param {number[]} start - 起始坐标 [lon1, lat1]
 * @param {number[]} end - 结束坐标 [lon2, lat2]
 * @param {number} t - 插值比例（0 到 1）
 * @returns {number[]} 插值后的坐标 [lon, lat]
 */
function slerp(start, end, t) {
    const [lon1, lat1] = start;
    const [lon2, lat2] = end;

    // 将经纬度转换为弧度
    const rad = (deg) => deg * (Math.PI / 180);
    const deg = (rad) => rad * (180 / Math.PI);

    const lat1Rad = rad(lat1);
    const lon1Rad = rad(lon1);
    const lat2Rad = rad(lat2);
    const lon2Rad = rad(lon2);

    // 计算球面插值
    const deltaLon = lon2Rad - lon1Rad;
    const cosLat1 = Math.cos(lat1Rad);
    const cosLat2 = Math.cos(lat2Rad);
    const sinLat1 = Math.sin(lat1Rad);
    const sinLat2 = Math.sin(lat2Rad);

    const angle = Math.acos(
        sinLat1 * sinLat2 + cosLat1 * cosLat2 * Math.cos(deltaLon)
    );
    const sinAngle = Math.sin(angle);

    if (sinAngle < 1e-6) {
        // 如果角度非常小，直接返回起始或结束点
        return t < 0.5 ? [lon1, lat1] : [lon2, lat2];
    }

    const a = Math.sin((1 - t) * angle) / sinAngle;
    const b = Math.sin(t * angle) / sinAngle;

    const x = a * cosLat1 * Math.cos(lon1Rad) + b * cosLat2 * Math.cos(lon2Rad);
    const y = a * cosLat1 * Math.sin(lon1Rad) + b * cosLat2 * Math.sin(lon2Rad);
    const z = a * sinLat1 + b * sinLat2;

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    return [deg(lon), deg(lat)];
}

/**
 * 对坐标列表进行插值
 * @param {number[][]} coordinates - 坐标列表 [[lon1, lat1, alt1], [lon2, lat2, alt2], ...]
 * @param {number} duration - 动画执行时间（毫秒）
 * @param {number} frameRate - 帧率（默认 60 帧/秒）
 * @returns {number[][]} 插值后的坐标列表
 */
export function interpolateCoordinates(coordinates, duration, frameRate = 60) {
    if (coordinates.length < 2) {
        throw new Error('至少需要两个坐标点');
    }

    const totalDistance = calculateTotalDistance(coordinates);
    const frameCount = Math.floor((duration / 1000) * frameRate); // 总帧数
    const result = [];
    const unitLength = totalDistance / frameCount; // 每帧的距离

    let distance = 0; // 当前总距离
    let currentFrame = 0; // 当前帧数

    let i = 0;
    while (currentFrame < frameCount) {
        const targetDistance = currentFrame * unitLength; // 目标距离

        for (; i < coordinates.length - 1; i++) {
            const partDistance = calculateDistance(coordinates[i], coordinates[i + 1]);

            if (distance + partDistance >= targetDistance) {
                const [lon1, lat1, alt1] = coordinates[i];
                const [lon2, lat2, alt2] = coordinates[i + 1];

                // 计算当前插值比例
                const t = partDistance ? (targetDistance - distance) / partDistance : 0;

                // 对经纬度进行球面插值
                const [lon, lat] = slerp([lon1, lat1], [lon2, lat2], t);

                // 对高度进行线性插值
                const alt = lerp(alt1, alt2, t);

                result.push([lon, lat, alt]);
                currentFrame++; // 增加帧数
                distance += partDistance; // 增加距离
                i++;
                break; // 退出当前循环，继续处理下一个帧
            }

            distance += partDistance; // 增加距离
        }
    }

    // 添加最后一个点
    result.push(coordinates[coordinates.length - 1]);

    return result;
}