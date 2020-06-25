

var debugBool = true;
var appName = app.getPackageName("今日头条极速版");

if (!test()) {
    module.exports = {
        type: "news",
        run: run,
        signIn: signIn,
        popUpEvent: popUpEvent
    }
}


function test() {


    // run(10);
    return false;
}

function run(count) {
    let newCount = 0;
    let index;
    //确定在头条页面
    readArticleOrWatchVideo();
    while (newCount < count) {
        if (!id("ada").depth(11).findOnce()) { readArticleOrWatchVideo(); }
        id("b_").depth(15).findOne(5000);
        let newList = id("b_").depth(15).find();  //获取所有文章的时间标注
        Log("控件count"+newList.length);
        if (newList.length > 0) {
            index = random(1, newList.length - 2);
            // if (index > newList.length - 1) { index--; }
            Log(index);
            if (!clickCenterByNode(newList[index])) { continue; }
            log("================第" + (newCount + 1) + "次阅读================");
            read() ? newCount++ : Log("没有找到文章");
            log("=========================================");
            do {
                back();
                Log("退出文章");
            } while (!depth(10).text("我的").findOne(5000));
        }
        sleep(150);
        Log("翻页");
        if (newCount % 3 == 0) {
            refush();
        } else {
            swipeVideo(1, 1000, 1500);
            sleep(150);
            swipeVideo(1, 1000, 1500);
        }

    }
}

function refush() {
    clickCenter(depth(15).text("热点"), 3000);
    sleep(1000);
    clickCenter(depth(15).text("热点"), 3000);
    while (text("正在努力加载").depth(19).findOne(500));
    swipeVideo(1, 1000, 1500);
}

function readArticleOrWatchVideo() {
    if (!menuArea(depth(10).text("我的"))) { return; }

    clickCenter(depth(10).text("我的"), 5000);
    sleep(1500);

    clickCenter(depth(10).text("首页"), 3000);

    refush();
}

function read() {
    //找到赏金控件
    for (let i = 0; i < 8; i++) {
        if (id("a8s").depth(14).findOne(1000)) { break; }
        if (i == 7 || id("a8e").depth(15).findOne(1000)) {
            return false;
        }
    }

    sleep(3000);
    log("趣头条---滑动文章或视频页中...");
    for (let i = 0; i < 5; i++) {
        swipeVideo(i);
        sleep(random(100, 150));
    }
    // Log(id("b0h").depth(21).findOnce())
    let temp = true;
    let temp2;
    while (temp) {
        temp = text("不喜欢").depth(22).findOne(random(500, 1000));
        temp2 = id("b0h").depth(21).findOnce();
        // Log(temp);
        if (temp && temp2) {
            temp = temp.bounds().height();
            temp2 = temp2.bounds().height();
            // Log(temp);
            // Log(temp2);
        } else {
            break;
        }
        if (temp > 0 || temp2 > 0) { break; }
        swipeVideo(1);
    }

    return true;

}


//未测试
function signIn() {
    if (!menuArea(depth(10).text("我的"))) { return; }

    clickCenter(depth(10).text("任务"), 3000);

    if (textContains("签到成功").depth(16).findOne(5000)) {
        clickCenter(depth(17).text("看视频再领"), 3000);
        sleep(20000);
        back();
    }
    else if (text("填写邀请码").depth(17).findOne(3000)) { return; }
    else if (text("签到未成功，请重试").depth(16).findOne(5000)) { clickCenter(text("好的").depth(16)); signIn(); }

}

/**
 * 主界面
 * @param {选择器}} mainSelector 主界面特征
 * @param {时间} time 查找时间
 */
function menuArea(mainSelector, time) {
    let searchTime = 0;
    if (time == undefined) {
        time = 15000;
    }
    for (let i = 0; searchTime <= time; i++) {
        if (mainSelector.findOnce()) {
            // Log("找到主界面");
            return true;
        } else {
            back();
            sleep(1000);
            searchTime += 1000;
        }
    }
    return false;
}

/**
 * 处理弹窗
 */
function popUpEvent() {
    if (textContains("没有响应").findOnce()) {
        sleep(1000);
        click("等待");
    }
    else if (textContains("跳过广告").findOnce()) {
        clickCenter(textContains("跳过广告"));
    }
    else if (text("0x+wcp2R1bM4bU8gAAAABJRU5ErkJggg==").depth(17).findOnce()) {
        clickCenter(text("0x+wcp2R1bM4bU8gAAAABJRU5ErkJggg==").depth(17));
    }
}

/**
 * 
 * @param {滑动次数} swipeCount 控制上下滑动
 * @param {随机时间上限} randTime1 
 * @param {随机时间下限} randTime2 
 * @param {滑动高度下限} baifenbi 例如0.8  屏幕高度的80%处
 */
function swipeVideo(swipeCount, randTime1, randTime2, baifenbi) {
    randTime1 = randTime1 || 3000;
    randTime2 = randTime2 || 3500;
    baifenbi = baifenbi || 0.75;

    const height = device.height;
    const width = device.width / 2;
    const upY = height * 0.15 + random(-50, 50);//视频下滑的长度 px
    const downY = height * baifenbi + random(-50, 50);
    let upSwipe = random(-6, 6);
    if (swipeCount == 1 || swipeCount % 5 != 0) {
        smlMove((width - random(-50, 50)), downY,
            (width + random(-50, 50)), upY, random(randTime1, randTime2));
    } else if (upSwipe % 6 == 0 || swipeCount == -1 || swipeCount % 5 == 0) {
        smlMove((width - random(-50, 50)), upY,
            (width + random(-50, 50)), downY, random(randTime1, randTime2));
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


/**
 * 点击控件中心
 * @param {选择器} selector 可以级联
 * @param {时间} time 选择器查找的时间
 */
function clickCenter(selector, time) {
    if (time == undefined) {
        time = 1000;
    }
    let node = selector.findOne(time);
    if (node) {
        let rect = node.bounds();
        sleep(150);
        click(rect.centerX(), rect.centerY());
        return true;
    }
    else {
        Log("没有找到选择器--->" + selector.toString());
        return false;
    }
}

function clickCenterByNode(node, time) {
    if (time == undefined) {
        time = 1000;
    }
    if (node) {
        let rect = node.bounds();
        if (!(rect.centerY() < 1150 && rect.centerY() > 150)) { return false; }
        sleep(150);
        click(rect.centerX(), rect.centerY());
        return true;
    }
    else {
        Log("没有找到");
        return false;
    }
}

function appBack(appName) {
    let curPackageName;
    curPackageName = depth(5).findOnce();
    if (curPackageName) {
        curPackageName = curPackageName.packageName();
        if (curPackageName == appName) {
            back();
        }
        else {
            app.launch(appName);
        }
    }
}


/**
 * 调试日志
 * @param {对象} obj 任意可输出的对象,
 * @param {debugBool} debugBool 在使用前确定已经声明全局变量 debugBool
 */
function Log(obj) {
    if (debugBool == undefined) {
        debugBool = false;
    }
    if (debugBool) {
        log("debug-->" + obj);
    }
}