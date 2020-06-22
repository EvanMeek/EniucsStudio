let uiBaseClick = require("../Libary/uiBase/CLICK.js");
let uiBaseSwipe = require("../Libary/uiBase/SWIPE.js");
/*
 趣头条
 签到，刷文章
 */

function test() {}
/**
 * 总流程
 * 1. 签到
 * 2. 天天领现金
 * 3. 阅读文章("重复10次")
 */
function 总流程() {
    // 签到
    signIn();
    sleep(2000);
    // 天天领现金
    taskGetMoney();
    sleep(2000);
    // 阅读文章或视频
    for (let i = 1; i <= 10; i++) {
        log("趣头条---阅读文章或视频中...当前次数: " + i);
        readArticleOrWatchVideo();
    }
}

/**
 * 天天领现金
 */
function taskGetMoney() {
    taskPapge();
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 400);
    let waitGet = text("待领取").findOne(2000)().parent().parent();
    if (uiBaseClick.clickCenterByNode(waitGet, 0, 1000)) {
        log("趣头条---天天领现金完成。");
    } else {
        log("趣头条---天天领现金模块失效，请联系上游修复。");
    }
}

/**
 * 签到
 */
function signIn() {
    taskPapge();
    // 观看视频领金币
    let getMoneyAndWatchVideo = className("android.widget.TextView").depth(6).drawingOrder(1).textContains("看视频再领");

    if (getMoneyAndWatchVideo.findOne(3000) != undefined) {
        getMoneyAndWatchVideo = getMoneyAndWatchVideo.findOne(2000)().parent();
        uiBaseClick.clickCenterByNode(getMoneyAndWatchVideo, 0, 5000);
        uiBaseClick.clickCenterBySelector(text("关闭").className("android.widget.TextView").indexInParent(1).drawingOrder(2).depth(9), 60000, 3);
        back();
        log("趣头条---签到完成。");
    } else {
        log("趣头条---签到观看视频模块失效，请联系上游修复。");
    }
}

/**
 * 跳转到任务页，并且处理筛选掉弹窗
 */
function taskPapge() {
    // 任务页
    let mainTaskBtn = className("android.widget.LinearLayout").depth(4).id("mg").findOne(2000)().child(3);
    if (uiBaseClick.clickCenterByNode(mainTaskBtn, 0, 5)) {
        log("趣头条---跳转至任务页成功!");
    } else {
        log("趣头条---无法跳转至任务页");
    }
}

/**
 * 看视频和阅读文章
 */
function readArticleOrWatchVideo() {
    // 首页右上角时段奖励
    let getMoney = className("android.widget.TextView").depth(13).indexInParent(3).drawingOrder(3);
    if (getMoney) {
        getMoney = getMoney.findOne(1000).parent().parent();
        uiBaseClick.clickCenterByNode(getMoney, 0, 1);
        let popupWindow = text("我知道了");
        if (uiBaseClick.clickCenterBySelector(popupWindow, 0, 1)) {
            log("趣头条---时段奖励CD中...");
        } else {
            log("趣头条---时段奖励领取成功。");
        }
        sleep(2000);
    }
    // 主页刷新
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 5000);
    /**
     * 首页第一篇文章或视频
     */
    let firstArt = className("android.widget.RelativeLayout").depth(13).drawingOrder(2).indexInParent(0).clickable(true);
    if (uiBaseClick.clickCenterBySelector(firstArt, 0, 2)) {
        log("趣头条---进入第一篇文章成功。");
        sleep(2000);
        swipePapge();
        back();
        sleep(2000);
    } else {
        log("趣头条---进入文章模块失效，请联系上游修复。");
    }
}

/**
 * 滑动文章
 */
function swipePapge() {
    log("趣头条---滑动文章或视频页中...");
    while (scrollDown()) {
        sleep(500);
    }
    for (let i = 0; i < 10; i++) {
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 200);
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 200);
    }
}

// test();

总流程();