/**
 * 根据设备屏幕高度上下滑动
 * @param direction 方向(0=下 1= 上)
 * @param delay 每次滑动后的延迟
 */
function swipeUpOrDownByDeviceHeight(direction, delay) {
    if (direction === 0) {
        // log("向下滚动", "延迟:" + delay);
        swipe(520, device.height * 0.8, 528, device.height * 0.2, 500);
        sleep(delay);
    } else if (direction === 1) {
        // log("向上滚动", "延迟:" + delay)
        swipe(520, device.height * 0.2, 528, device.height * 0.8, 500);
        sleep(delay);
    }
}
/**
 * 仿真随机滑动
 * @param {滑动方向} swipeDirection 控制上下滑动
 * @param {随机时间上限} randomTimeMax
 * @param {随机时间下限} randomTimeMin
 * @param {滑动高度下限} swipeHeightMin 例如0.8  屏幕高度的80%处
 */
function swipeRandomByDeviceHeight(swipeDirection, randomTimeMax, randomTimeMin, swipeHeightMin) {
    randomTimeMax = randomTimeMax || 3000;
    randomTimeMin = randomTimeMin || 3500;
    swipeHeightMin = swipeHeightMin || 0.75;

    const height = device.height;
    const width = device.width / 2;
    const upY = height * 0.15 + random(-50, 50);//视频下滑的长度 px
    const downY = height * swipeHeightMin + random(-50, 50);
    let upSwipe = random(-6, 6);
    if (swipeDirection == 1 || swipeDirection % 2 == 0) {
        smlMove((width - random(-50, 50)), downY,
            (width + random(-50, 50)), upY, random(randomTimeMax, randomTimeMin));
    } else if (upSwipe % 6 == 0 || swipeDirection == -1 || swipeDirection % 2 != 0) {
        smlMove((width - random(-50, 50)), upY,
            (width + random(-50, 50)), downY, random(randomTimeMax, randomTimeMin));
    }
}


/**
 * 仿真随机带曲线滑动  (视频滑动)
 * @param {起点x} qx
 * @param {起点y} qy
 * @param {终点x} zx
 * @param {终点y} zy
 * @param {过程耗时单位毫秒} time
 */
function smlMove(qx, qy, zx, zy, time) {
    var xxy = [time];

    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };

    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };

    var dx3 = {
        "x": zx,
        "y": zy
    };

    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");

    };
    /**
     * 仿真随机带曲线滑动的子方法
     * @param {*} cp
     * @param {*} t
     */
    function bezierCurves(cp, t) {
        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;

        tSquared = t * t;
        tCubed = tSquared * t;
        result = {
            "x": 0,
            "y": 0
        };
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
        return result;
    }

    // Log(point[3].x)
    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)]
        xxy.push(xxyy);
    }

    // Log(xxy);
    gesture.apply(null, xxy);
};
module.exports = {
    swipeUpOrDownByDeviceHeight:swipeUpOrDownByDeviceHeight,
    swipeRandomByDeviceHeight: swipeRandomByDeviceHeight
}
