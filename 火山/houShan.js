var debugBool = true;

// test();

function test() {
    // signIn();
    run(2);

}

/**
 * 整个视频流程(核心) 
 * @param {总时间} totalTime 刷视频的时长,单位分钟
 * 适用于类似快手极速版刷视频界面
 */
function run(totalTime, boolLikeAndFollow) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    totalTime = totalTime * 60; //把分钟转换为秒数
    totalTime += random(-60, 180);//随机加减总时间
    Log("计划时长：" + totalTime);
    let watchTime = 0;
    brushVideoArea();//确定在刷视频界面
    for (let i = 1; totalTime > watchTime; i++) {
        let waitTime = perVideoWatchTime + random(-2, 4)
        // Log("本视频观看时长" + waitTime);
        sleep(waitTime / 2 * 1000);
        likeAndFollow(20, boolLikeAndFollow);
        drawRedPacket();
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        misoperationDetection();
        // Log("已看：" + i + "个视频 " + watchTime + "秒");
        swipeVideo(i);
    }
    Log("本次观看时长" + watchTime + "秒");
}

function brushVideoArea() {
    if (menuArea(text("我的"), 15000)) {
        clickCenter(text("首页"));
    }
}

/**
 * 领取广告红包
 */
function drawRedPacket() {
    if (id("a3b").findOne(1500)) {
        Log("红包");
        // sleep(15000);
        // clic(k("领取");
        clickCenter(id("a3b").text("领取"), 15000);
        // back();
    }
}

/**
 * 误操作bug(暂时无法根治)
 */
function misoperationDetection() {
    if (text("开宝箱得金币").findOnce() && !id("ve").findOnce()) {
        Log("bug");
        back();
        sleep(1000);
    }
}


/**
 * 签到
 */
function signIn() {
    //重写
    if (menuArea(text("我的"), 15000)) {
        clickCenter(text("红包"));
    }
}

/**
 * 处理弹窗
 */
function popUpEvent() {
    if (textContains("没有响应").findOnce()) {
        sleep(1000);
        click("等待");
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
            searchTime += 3000;
        }
    }
    return false;
}

/**
 * 滑动视频
 * @param {滑动次数} swipeCount 
 */
function swipeVideo(swipeCount) {
    const height = device.height / 2;
    const width = device.width / 2;
    const videoSwipeDistance = height - 100;//视频下滑的长度 px
    let offSet = random(-100, 0)
    let upSwipe = random(-6, 6);
    if (upSwipe == 0) {
        //  随机上滑
        smlMove(width + random(-50, 50), height + offSet,
            width + random(-50, 50), height + offSet + (videoSwipeDistance / 2), 30);
    }
    else if (swipeCount == 1) {
        smlMove((width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
            (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2)), 30);
    }
    else {
        smlMove((width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
            (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2)), 30);
    }
}

/**
 * 随机点赞或者关注和或者减少类似作品
 * @param {点赞概率} range 有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
 * 1. 获取需要双击喜欢的坐标点
 * 2. 判断随机数 如果喜欢了再判断关注
 */
function likeAndFollow(range, bool) {
    if (bool == undefined) {
        bool = true;
    }
    if (!bool) {
        return;
    }
    //获取设备宽高
    const height = (device.height / 2) + random(20, 50);
    const width = (device.width / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    if (isLike == 0) {
        click(width, height);
        sleep(50);
        click(width, height);
        Log("双击喜欢");
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            click("关注");
            Log("点了关注");
        } else {
            // Log("不是点关注的概率:"+isFollow)
        }
    }
    else {
        // Log("不是点喜欢的概率:"+isLike)
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

/**
 * 区域找色(节点版)
 * @param {图片} img 屏幕截图
 * @param {颜色} color 需要找的颜色
 * @param {选择器} selector 例如id("xxxx"),可以级联
 * @param {时间} time 找色的时间
 */
function nodeFindColor(img, color, selector, time) {
    let searchTime = 0;
    let node = selector.findOne(1500);
    let returnValue;
    if (node) {
        let rect = node.bounds();
        for (let i = 0; searchTime <= time; i++) {
            returnValue = images.findColor(img, color, {
                region: [rect.left, rect.top, rect.width(), rect.height()],
                threshold: 0.8
            });
            if (returnValue) {
                return returnValue;
            }
            sleep(100);
            searchTime += 100;
        }
        Log("找色超时");
        return returnValue;
    } else {
        Log("失败");
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


// 需要调用时取消注释
module.exports = {
    type:"video",
    run: run,    //刷视频
    signIn: signIn,  //签到
    popUpEvent: popUpEvent,  //弹窗
}