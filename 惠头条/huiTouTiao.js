let uiBaseClick = require("../Libary/uiBase/CLICK.js");

function test() {
    popupWindow();
    for (let i = 0; i < 5; i++) {
        readArticle();
    }
}

/**
 * 阅读文章
 */
function readArticle(){
    // 去往首页,如果仍然在首页，是会刷新的。
    mainPage();
    sleep(1000);
    // 跳转至首页的头条
    headLineTab();
    sleep(1000);
    // 刷新页面;
    mainPage();
    sleep(1000);
    sU(0,2000);
    // 找id为tv_news_timeline的可点击父级容器
    let art = id("tv_news_timeline").findOnce();
    if(art!=undefined){
        log("惠头条---寻找文章成功。");
        art = art.parent().parent().parent().parent().parent().parent().parent();
        if (uiBaseClick.clickCenterByNode(art, 0, 1)) {
            log("惠头条---进入文章成功。");
            swipeArticle();
            back();
        }else{
            log("惠头条---进入文章失效，请联系上游修复。");
        }
    }else{
        log("惠头条---寻找文章失效，请联系上游修复。");
    }
    sleep(2000);
}

/**
 * 滑动文章
 */
function swipeArticle(){
    log("惠头条---滑动文章或视频页中...");
    for (let i = 0; i < 5; i++) {
        sU(0,1000);
    }
    for (let i = 0; i < 10; i++) {
        sU(1, 1500);
        sU(0, 1500);
    }
}
/**
 * 跳转至首页头条栏
 */
function headLineTab(){
    sleep(1000);
    let tabNews = id("tab_news").findOnce();
    if(tabNews!==undefined){
        tabNews = tabNews.child(0);
        let hotTab = tabNews.child(0);
        if(uiBaseClick.clickCenterByNode(hotTab)){
            log("惠头条---跳转首页头条成功!");
        }else{
            log("惠头条---跳转首页头条失效，请联系上游修复。");
        }
    }else{
        log("惠头条---跳转首页头条失效，请联系上游修复。");
    }
}
/**
 * 跳转至首页
 */
function mainPage(){
    let tabs = id("tabs").findOnce().child(0);
    let mainPage = tabs.child(0);
    if(uiBaseClick.clickCenterByNode(mainPage)){
        log("惠头条---跳转首页成功!");
    }else{
        log("惠头条---跳转首页失效，请联系上游修复。");
    }
}

function taskPage(){
    let tabs = id("tabs").findOnce().child(0);
    let taskPage = tabs.child(3);
    if (uiBaseClick.clickCenterByNode(taskPage)) {
        log("惠头条---跳转任务页成功!");
    }else{
        log("惠头条---跳转任务页失效，请联系上游修复。");
    }
}

/**
 * 滑动页面
 * @param direction
 * @param delay
 */
function sU(direction, delay) {
    if (direction === 0) {
        // log("向下滚动", "延迟:" + delay);
        swipe(520, 1920, 528, 320, 500);
        sleep(delay);
    } else if (direction === 1) {
        // log("向上滚动", "延迟:" + delay)
        swipe(520, 320, 528, 1920, 500);
        sleep(delay);
    }
}


function popupWindow(){
    /*
     IIRoot
     > ImageView
     --- id: img_close
     > ImageView
     --- id: img
     */
    // 邀请好友赚钱
    threads.start(function () {
        while (true){
            let img_close = id("img_close");
            uiBaseClick.clickCenterBySelector(img_close,0,1);
            let iv_card_discard = id("iv_card_discard");
            uiBaseClick.clickCenterBySelector(iv_card_discard,0,1);
        }
    });
}
test();