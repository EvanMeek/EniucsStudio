function test() {
    // let watchVideoGetMoney = textContains("看完视频");
    // log("hello");
    // clickCenter(watchVideoGetMoney, 0, 2);
    openTreasureChest();
}

/**
 * 监测是否有即时推送弹窗
 */
function monitorLivePush() {
    let livePushThread = threads.start(function () {
        while (true) {
            let livePushWindow = text("即时推送").findOne(1000);
            if (livePushWindow != undefined) {
                let livePushWindow = livePushWindow.parent();
                clickCenterBySelector(text("忽略").depth(4).drawingOrder(5).className("android.widget.TextView").clickable(true), 2000);
            }
            log("未监测到即时推送");
            // 一分钟监测一次
            sleep(60000);
        }
    });
}

/**
 * 打开宝箱
 */
function openTreasureChest() {
    // 跳转到任务页
    taskPapge();
    // 宝箱控件
    let treasureChest = className("android.widget.Image").depth(16).indexInParent(0).clickable(false).textContains("treasure");
    if (treasureChest != undefined) {
        treasureChest = treasureChest.findOnce().parent();
        // 点击宝箱
        clickCenterByNode(treasureChest, 0, 20);
        sleep(2000);
        // 看视频领金币
        let watchVideoGetMoney = textContains("看完视频再领");
        clickCenterBySelector(watchVideoGetMoney, 0, 2);
        let closeADVideo = text("关闭广告");
        clickCenterBySelector(closeADVideo, 0, 30);
    } else {
        log("今日头条---点击宝箱模块失效，请联系上游修复。")
    }
}

/**
 * 跳转到任务页，并且处理筛选掉弹窗
 */
function taskPapge() {
    // 任务页
    let mainTaskBtn = className("android.widget.TabWidget").depth(8).id("tabs").findOnce().child(3);
    mainTaskBtn.click();
    // 监测是否有邀请码弹窗
    let inviteCode = textContains("点击填写邀请码");
    if (inviteCode != undefined) {
        // 进入输入邀请码界面
        clickCenterBySelector(inviteCode, 2000,2000);
        // 然后返回;
        back();
    }
    sleep(4000);
}

function readArticle() {
    sleep(1000);
    taskPapge();
    sleep(1000);
    swipe(520, 1920, 528, 320, 100);
    sleep(800);
    swipe(520, 1920, 528, 320, 100);
    sleep(800);
    swipe(520, 1920, 528, 320, 100);
    // 从任务页找到阅读文章入口
    let taskReadArticleOrVideo = className("android.view.View").depth(15).clickable(true).indexInParent(23);
    if (clickCenterBySelector(taskReadArticleOrVideo, 2000)) {
        swipe(520, 500, 520, 1920, 2000);
        sleep(1000);
        swipe(520, 500, 520, 1920, 2000);
        sleep(1000);
        // 首页文章列表
        let mainArticleList = className("android.support.v7.widget.RecyclerView").depth(14).indexInParent(1).drawingOrder(2).findOnce().children();
        log("文章个数：" + mainArticleList.size());
        mainArticleList.forEach(function (art) {
            log(art.indexInParent() + "=======");
            // 过滤掉两个置顶
            if (art.indexInParent() == 2 || art.indexInParent() == 3 || art.indexInParent() == 0) {
                log("fuck autojs bug!!!");
            } else {
                log(art.bounds());
                // 进入文章
                clickCenterByNode(art,1000,1);
                // 开始阅读
                swipePapge();
                // 返回上个页面
                back();
                sleep(1000);
            }
        });
    } else {
        log("今日头条---进入阅读文章模块失效，请联系上游修复。");
    }
}

/**
 * 阅读文章，滑动
 */
function swipePapge() {
    sleep(1000);
    sU(0, 1000);
    sU(0, 2000);
    sU(0, 2000);
    sU(1, 2000);
    sU(0, 1000);
    sU(0, 1000);
    sU(1, 2000);
    sU(0, 2000);
    sU(0, 1000);
    sU(1, 2000);
    sU(0, 1000);
    sU(0, 1000);
    for (let i = 0; i < 40; i++) {
        sU(0, 200);
    }
}

function sU(direction, delay) {
    if (direction === 0) {
        log("向下滚动", "延迟:" + delay);
        swipe(520, 1920, 528, 320, 500);
        sleep(delay);
    } else if (direction === 1) {
        log("向上滚动", "延迟:" + delay)
        swipe(520, 320, 528, 1920, 500);
        sleep(delay);
    }
}

/**
 * 签到
 * 流程:
 * 1. 进入任务页面，当天第一次进入会自动签到
 * 2. 自动监测今日是否已签到(如果未监测到，则会提示模块失效)
 * 3. 自动观看每日签到的广告视频
 * 4. 自动关闭广告视频
 */
function taskSignIn() {
    // 进入任务页按钮
    taskPapge();
    // 是否已签到
    let isSignIn = textContains("今日已签").findOne(2000);
    // 如果今日已签到，那么就可点击看视频得金币了
    if (isSignIn != undefined) {
        // 看视频得金币
        let watchVideoGetMoney = textContains("看视频再领");
        clickCenterBySelector(watchVideoGetMoney);
        sleep(1000);
        // 关闭广告视频
        let closeADVideo = text("关闭广告");
        clickCenterBySelector(closeADVideo, 0, 30);
        sleep(1000);
    } else {
        log("今日头条----今日已签到。");
    }
}

/**
 * 点击选择器中心
 * @param node 节点
 * @param time 寻找时间(ms)
 * @param delay 延迟(s)
 * @returns {boolean}
 */
function clickCenterBySelector(selector, time, delay) {
    if (time == undefined || time == 0 || delay == undefined) {
        time = 1000;
        delay = 0.2;
    }
    node = selector.findOne(time);
    if (node) {
        let rect = node.bounds();
        click(rect.centerX(), rect.centerY());
        sleep(delay * 1000);
        return true;
    } else {
        log("没有找到" + selector.toString() + "控件!");
        return false;
    }
}

/**
 * 点击节点中心
 * @param node 节点
 * @param time 寻找时间(ms)
 * @param delay 延迟(s)
 * @returns {boolean}
 */
function clickCenterByNode(node, time, delay) {
    if (time == undefined || time == 0 || delay == undefined) {
        time = 1000;
        delay = 0.2;
    }
    if (node) {
        let rect = node.bounds();
        click(rect.centerX(), rect.centerY());
        sleep(delay * 1000);
        return true;
    } else {
        log("没有找到" + node.toString() + "控件!");
        return false;
    }
}


test();
// todayHeadlinesearch();
