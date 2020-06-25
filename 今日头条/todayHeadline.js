let uiBaseClick = require("../Libary/uiBase/CLICK.js");
let uiBaseSwipe = require("../Libary/uiBase/SWIPE.js");

/**
 * 总流程
 * @param {count} 篇数
 */
function run(count) {
    for (let i = 0; i < count; i++) {
        readArticle();
    }
}

/**
 * 监测是否有即时推送弹窗
 */
function monitorLivePush() {
    let livePushWindow = text("即时推送").findOne(1000);
    if (livePushWindow != undefined) {
        let livePushWindow = livePushWindow.parent();
        uiBaseClick.clickCenterBySelector(text("忽略").depth(4).drawingOrder(5).className("android.widget.TextView").clickable(true), 2000);
    } else {
        log("今日头条---未监测到即时推送");
    }
}

/**
 * 打开宝箱
 */
function openTreasureChest() {
    // 跳转到任务页
    taskPapge();
    // 宝箱控件
    let treasureChest = className("android.widget.Image").depth(16).textContains("treasure");
    if (treasureChest) {
        treasureChest = treasureChest.findOne(2000).parent();
        // 点击宝箱
        uiBaseClick.clickCenterByNode(treasureChest, 0, 2);
        // 看视频领金币
        let watchVideoGetMoney = textContains("看完视频再领");
        uiBaseClick.clickCenterBySelector(watchVideoGetMoney, 0, 2);
        let closeADVideo = text("关闭广告");
        uiBaseClick.clickCenterBySelector(closeADVideo, 0, 30);
    } else {
        log("今日头条---点击宝箱模块失效，请联系上游修复。")
    }
}

/**
 * 跳转到任务页，并且处理筛选掉弹窗
 */
function taskPapge() {
    // 任务页
    let mainTaskBtn = className("android.widget.TabWidget").depth(8).id("tabs").findOne(2000);
    if (mainTaskBtn) {
        mainTaskBtn = mainTaskBtn.child(3);
        mainTaskBtn.click();
        // 监测是否有邀请码弹窗
        let inviteCode = textContains("点击填写邀请码");
        if (inviteCode) {
            // 进入输入邀请码界面
            uiBaseClick.clickCenterBySelector(inviteCode, 2000, 2000);
            // 然后返回;
            back();
        }
        sleep(4000);
    }
}

/**
 * 跳转到任务页，并且处理筛选掉弹窗
 */
function mainPapge() {
    // 任务页
    let mainTaskBtn = className("android.widget.TabWidget").depth(8).id("tabs").findOne(2000);
    if (mainTaskBtn) {
        mainTaskBtn = mainTaskBtn.child(0);
        if (uiBaseClick.clickCenterByNode(mainTaskBtn, 2000, 5)) {
            log("进入首页成功");
            sleep(2000);
        } else {
            log("进入首页失败");
        }
    }
}

/**
 * 阅读文章
 */
function readArticle() {
    sleep(1000);
    // 去往任务
    mainPapge();
    swipe(520, 500, 520, 1920, 2000);
    sleep(5000);
    swipe(520, 500, 520, 1920, 2000);
    sleep(5000);
    let mainArticleList = className("android.support.v7.widget.RecyclerView").depth(14).find();
    if (!mainArticleList.empty()) {
        // 首页文章列表
        mainArticleList = mainArticleList[1].children();
        // 可点击文章列表
        mainArticleList = mainArticleList.find(className("android.widget.RelativeLayout").depth(15));
        if (uiBaseClick.clickCenterByNode(mainArticleList[2], 5000, 5)) {
            log("今日头条---进入文章成功!");
            // 开始阅读
            swipePapge();
            back();
            sleep(5000);
        } else {
            log("今日头条---进入文章失败.");
        }
    }
}

/**
 * 阅读文章，滑动
 */
function swipePapge() {
    sleep(1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    for (let i = 0; i < 40; i++) {
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 200);
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
function signIn() {
    // 进入任务页按钮
    taskPapge();
    // 是否已签到
    let isSignIn = textContains("今日已签").findOne(2000);
    // 如果今日已签到，那么就可点击看视频得金币了
    if (isSignIn != undefined) {
        // 看视频得金币
        let watchVideoGetMoney = textContains("看视频再领");
        uiBaseClick.clickCenterBySelector(watchVideoGetMoney);
        sleep(1000);
        // 关闭广告视频
        let closeADVideo = text("关闭广告");
        uiBaseClick.clickCenterBySelector(closeADVideo, 0, 30);
        sleep(1000);
    } else {
        log("今日头条----今日已签到。");
    }
}

module.exports = {
    type: "news",
    run: run,
    signIn: signIn,
    popUpEvent: monitorLivePush
}
