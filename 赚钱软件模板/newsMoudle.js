var debugBool = true;

function test() {
    run(5);
}

function run(count) {
    //确定在头条页面
    newsArea();
    //开始刷
    readNews(count);
}

/**
 * 进入刷文章的界面
 */
function newsArea() {
    if (!menuArea(depth(10).text("我的"))) { return; }

    clickCenter(depth(10).text("我的"), 5000);
    sleep(1500);

    clickCenter(depth(10).text("头条"), 3000);

    clickCenter(depth(10).text("刷新"), 3000);
}

/**
 * 刷文章
 * @param {数量}} count 文章的篇数
 * 
 */
function readNews(count){
    let newCount = 0;
    let selector = id("tv_news_timeline").depth(21);    //文章的选择器
    while (newCount < count) {
        Log(selector.findOne(5000));
        let newList = selector.find();  //获取所有文章的时间标注
        Log(newList.length);
        if (newList.length > 0) {
            clickCenterByNode(newList[random(0, (newList.length - 1))]);
            log("================第" + (newCount + 1) + "次阅读================");
            read() ? newCount++ : Log("没有找到文章");
            log("=========================================");
            do {
                back();
                Log("退出文章");
            } while (!selector.findOne(5000));
        }
        Log("翻页");
        swipeVideo(1, 1000, 1500);
        sleep(150);
        swipeVideo(1, 1000, 1500);
    }
}

/**
 * 模拟人工阅读新闻
 * 如果在阅读中会有其他的情况,可以重构
 */
function read() {
    //找到进入文章后唯一特征
    if (!id("circle_progress").depth(11).findOne(15000)) { return false; }
    sleep(3000);
    log("头条---滑动文章或视频页中...");
    for (let i = 0; i < 10; i++) {
        swipeVideo(i);
        sleep(random(100, 150));
        // if (textContains("展开全文").depth(18).findOnce()) { clickCenter(textContains("展开全文").depth(18)); }

        // if (id("iv_banner_comment").depth(12).findOnce()) { click("文章"); }
    }
    return true;
}

//未测试
function signIn() {
    if (!menuArea(depth(7).text("我的"))) { return; }

    clickCenter(depth(7).text("任务"), 5000);

    if (clickCenter(depth(6).text("看视频再领"), 3000)) {
        Log("签到");
        clickCenter(text("关闭").className("android.widget.TextView").depth(9), 60000);
    } else {
        Log("已签到");
    }
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
    if (swipeCount == 1 || swipeCount % 2 == 0) {
        smlMove((width - random(-50, 50)), downY,
            (width + random(-50, 50)), upY, random(randTime1, randTime2));
    } else if (upSwipe % 6 == 0 || swipeCount == -1 || swipeCount % 2 != 0) {
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
        sleep(150);
        click(rect.centerX(), rect.centerY());
        return true;
    }
    else {
        Log("没有找到");
        return false;
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