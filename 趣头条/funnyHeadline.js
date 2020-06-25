let uiBaseClick = require("../Libary/uiBase/CLICK.js");
let uiBaseSwipe = require("../Libary/uiBase/SWIPE.js");
/*
 趣头条
 签到，刷文章
 */

// test();

function test() {
    run(5);
}
/**
 * 总流程
 * 1. 签到
 * 2. 天天领现金
 * 3. 阅读文章("重复10次")
 */
function run(count) {
    // 天天领现金
    taskGetMoney();
    sleep(2000);
    // 阅读文章或视频
    for (let i = 1; i <= count; i++) {
        log("================第" + i + "次运行================");
        readArticleOrWatchVideo();
        log("=========================================");
    }
}

/**
 * 天天领现金
 */
function taskGetMoney() {
    taskPapge();
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 400);
    let waitGet = text("待领取").findOne(5000);
    if (waitGet) {
        waitGet = waitGet.parent().parent();
        if (uiBaseClick.clickCenterByNode(waitGet, 5, 5)) {
            log("趣头条---天天领现金完成。");
        } else {
            log("趣头条---天天领现金模块失效，请联系上游修复。");
        }
    }
}

/**
 * 签到
 */
function signIn() {
    sleep(10 * 1000);
    taskPapge();
    // 观看视频领金币
    let getMoneyAndWatchVideo = className("android.widget.TextView").depth(6).drawingOrder(1).textContains("看视频再领");

    if (getMoneyAndWatchVideo.findOne(3000) != undefined) {
        getMoneyAndWatchVideo = getMoneyAndWatchVideo.findOne(2000).parent();
        uiBaseClick.clickCenterByNode(getMoneyAndWatchVideo, 5, 5);
        uiBaseClick.clickCenterBySelector(text("关闭").className("android.widget.TextView").indexInParent(1).drawingOrder(2).depth(9), 60000, 3);
        back();
        log("趣头条---签到完成。");
    } else {
        log("趣头条---今日已签到!");
    }
}

/**
 * 跳转到任务页，并且处理筛选掉弹窗
 */
function taskPapge() {
    // 任务页
    let mainTaskBtn = className("android.widget.LinearLayout").depth(4).id("mq").findOne(5000);
    if (mainTaskBtn != undefined) {
        mainTaskBtn = mainTaskBtn.child(3);
        if (uiBaseClick.clickCenterByNode(mainTaskBtn, 5, 5)) {
            log("趣头条---跳转至任务页成功!");
        } else {
            log("趣头条---无法跳转至任务页");
        }
    }
}

/**
 * 看视频和阅读文章
 */
function readArticleOrWatchVideo() {
    // 回到首页
    mainPage();
    // 首页右上角时段奖励
    let getMoney = className("android.widget.TextView").depth(13).indexInParent(3).drawingOrder(3).findOne(5000);
    if (getMoney != undefined) {
        getMoney = getMoney.parent().parent();
        if (uiBaseClick.clickCenterByNode(getMoney, 5000, 5)) {
            log("趣头条---时段奖励领取成功。");
        }
        sleep(2000);
    } else {
        log("趣头条---时段奖励CD中。");
    }
    // 主页刷新
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 5000);
    /**
     * 首页第一篇文章或视频
     */
    let art = id("xw").depth(15).indexInParent(3).findOne(5000);
    if (art!=undefined){
        if (uiBaseClick.clickCenterByNode(art, 5000, 3)) {
            log("趣头条---进入文章成功。");
            sleep(1000);
            swipePapge();
            back();
            sleep(1000);
        } else {
            log("趣头条---进入文章模块失效，请联系上游修复。");
        }
    }
}

/**
 * 跳转至首页
 */
function mainPage() {
    let myPageBtn = textContains("我的").depth(7).findOne(5000);
    if(myPageBtn){
        uiBaseClick.clickCenterByNode(myPageBtn,5000,5);
        let mainPageBtn = textContains("头条").depth(7).findOne(5000);
        if (mainPageBtn) {
            if (uiBaseClick.clickCenterByNode(mainPageBtn, 5000, 5)) {
                log("趣头条---跳转至首页成功!");
            } else {
                log("趣头条---无法跳转至首页。");
            }
        }
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
        // uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 500);
        // uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 500);
        uiBaseSwipe.swipeRandomByDeviceHeight(i);
    }
}

function popupWindow() {
    // 初始化界面的广告
    let initPage = textContains("跳过广告");
    uiBaseClick.clickCenterBySelector(initPage, 5000, 2);
    let rewardMoney = id("a3u").depth(4);
    uiBaseClick.clickCenterBySelector(rewardMoney, 0, 2);
}


module.exports = {
	type: "news",
	run: run,
	signIn: signIn,
	popUpEvent: popupWindow
}
