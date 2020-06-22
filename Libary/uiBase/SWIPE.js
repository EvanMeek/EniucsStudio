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

module.exports = {
    swipeUpOrDownByDeviceHeight:swipeUpOrDownByDeviceHeight
}
