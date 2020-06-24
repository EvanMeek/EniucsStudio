let uiBaseClick = require("../Libary/uiBase/CLICK.js");
let uiBaseSwipe = require("../Libary/uiBase/SWIPE.js");

function test() {
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0,200);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0,200);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0,200);
}

/**
 * run
 * @param {count} 篇数
 */
function run(count) {
    // 等待第一次打开时的广告
    sleep(20*1000);
    // 阅读文章
    for (let i = 0; i < count; i++) {
	log("================第"+(i+1)+"次运行================");
        readArticle();
	log("========================================");
    }
}

/**
 * 阅读文章
 */
function readArticle() {
    // 去往首页,如果仍然在首页，是会刷新的。
    mainPage();
    sleep(2000);
    // 跳转至首页的头条
    headLineTab();
    sleep(1000);
    // 刷新页面;
    mainPage();
    sleep(2000);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1500);
    uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1500);
    sleep(2000);
    // 找id为tv_news_timeline的可点击父级容器
    let art = id("tv_news_timeline").findOne(2000);
    if (art != undefined) {
        log("惠头条---寻找文章成功。");
        art = art.parent().parent().parent().parent().parent().parent().parent();
        if (uiBaseClick.clickCenterByNode(art, 0, 2, true)) {
            log("惠头条---进入文章成功。");
            swipeArticle();
            back();
        } else {
            log("惠头条---进入文章失效，请联系上游修复。");
        }
    } else {
        log("惠头条---寻找文章失效，请联系上游修复。");
    }
    sleep(2000);
}

/**
 * 滑动文章
 */
function swipeArticle() {
    log("惠头条---滑动文章或视频页中...");
    for (let i = 0; i < 5; i++) {
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1000);
    }
    for (let i = 0; i < 10; i++) {
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(1, 1500);
        uiBaseSwipe.swipeUpOrDownByDeviceHeight(0, 1500);
    }
}

/**
 * 跳转至首页头条栏
 */
function headLineTab() {
    sleep(1000);
    let tabNews = id("tab_news").findOne(2000);
    if (tabNews !== undefined) {
        tabNews = tabNews.child(0);
        let headLine = tabNews.child(0);
        if (uiBaseClick.clickCenterByNode(headLine, 0, 2, true)) {
            log("惠头条---跳转首页头条成功!");
        } else {
            log("惠头条---跳转首页头条失效，请联系上游修复。");
        }
    } else {
        log("惠头条---跳转首页头条失效，请联系上游修复。");
    }
}

/**
 * 跳转至首页
 */
function mainPage() {
    let tabs = id("tabs").findOne(2000).child(0);
    let mainPage = tabs.child(0);
    if (uiBaseClick.clickCenterByNode(mainPage,0,2)) {
        log("惠头条---跳转首页成功!");
    } else {
        log("惠头条---跳转首页失效，请联系上游修复。");
    }
}

function taskPage() {
    let tabs = id("tabs").findOne(2000).child(0);
    let taskPage = tabs.child(3);
    if (uiBaseClick.clickCenterByNode(taskPage,0,2)) {
        log("惠头条---跳转任务页成功!");
    } else {
        log("惠头条---跳转任务页失效，请联系上游修复。");
    }
}

function popupWindow() {
    /*
     IIRoot
     > ImageView
     --- id: img_close
     > ImageView
     --- id: img
     */
    // 邀请好友赚钱
    let img_close = id("img_close");
    uiBaseClick.clickCenterBySelector(img_close, 0, 1);
    let iv_card_discard = id("iv_card_discard");
    uiBaseClick.clickCenterBySelector(iv_card_discard, 0, 1);
    let rewardMoney = id("a3u").depth(4);
    uiBaseClick.clickCenterBySelector(rewardMoney,0,1);
}
function signIn(){}

module.exports = {
    type: "news",
    run: run,
    signIn: signIn,
    popUpEvent: popupWindow
}
