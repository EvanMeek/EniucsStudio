/**
 * 点击选择器中心
 * @param selector 选择器
 * @param time 寻找时间(ms)
 * @param delay 延迟(s)
 * @param ignoreLog 是否忽略延迟(true/false)
 * @returns {boolean}
 */
function clickCenterBySelector(selector, time, delay, ignoreLog) {
    if (time == undefined || time == 0) {
        time = 1000;
    }else if(delay == undefined || delay == 0){
	delay = 0.2;
    }
    let node = selector.findOne(time);
    if (node) {
        let rect = node.bounds();
        click(rect.centerX(), rect.centerY());
        sleep(delay * 1000);
        return true;
    } else {
        if (ignoreLog) {
            log("没有找到" + selector.toString() + "控件!");
        }
        return false;
    }
}

/**
 * 点击节点中心
 * @param node 节点
 * @param time 寻找时间(ms)
 * @param delay 延迟(s)
 * @param ignoreLog 是否忽略延迟(true/false)，默认为true
 * @returns {boolean}
 */
function clickCenterByNode(node, time, delay, ignoreLog) {
    if (time == undefined || time == 0) {
        time = 1000;
    }else if(delay == undefined || delay == 0){
	delay = 0.2;
    }
    if (node) {
        let rect = node.bounds();
        click(rect.centerX(), rect.centerY());
        sleep(delay * 1000);
        return true;
    } else {
        if (ignoreLog) {
            log("没有找到" + node.toString() + "控件!");
        }
        return false;
    }
}

module.exports = {
    clickCenterByNode: clickCenterByNode,
    clickCenterBySelector: clickCenterBySelector,
}
