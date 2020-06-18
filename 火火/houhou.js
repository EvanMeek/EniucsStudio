
test();

function test() {
//    goldenEgg();
    run(1200);
}

function goldenEgg(){
    if(text("金蛋大奖").findOne(1000)){
        clickCenter(text("金蛋大奖").findOne(1000));
        clickCenter(id("ki").findOne(3000));
    }
}

function Pop(){
    if(text("赚钱小技巧").findOne(1000)){
        back();
    }
}


function signIn() {
    let is;
    clickCenter(text("刷新").findOne(3000));
    is = clickCenter(textContains("看视频").findOne(3000));
    if(!is){
        return;
    }
    is = clickCenter(textContains("金币翻倍").findOne(3000));
    if(!is){
        return;
    }
    if (text("点击重播").findOne(65000)) {
        back();
    }
    clickCenter(id("ki").findOne(3000));
}

function run(totalTime) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    totalTime += random(-60, 180);
    log("计划时长：" + totalTime)
    let watchTime = 0;
    clickCenter(text("小视频").findOne(3000));
    for (let i = 1; totalTime > watchTime; i++) {
        let waitTime = perVideoWatchTime + random(-2, 4)
        // log("本视频观看时长" + waitTime);
        sleep(waitTime / 2 * 1000);
        likeAndFollow(20);
        goldenEgg();
        Pop();
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        // log("已看：" + i + "个视频 " + watchTime + "秒");  
        swipeVideo(i);
    }
    Log("本次观看时长" + watchTime + "秒");
}

/**
 * 随机点赞或者关注和或者减少类似作品
 * @param {点赞概率} range 有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
 * 1. 获取需要双击喜欢的坐标点
 * 2. 判断随机数 如果喜欢了再判断关注
 */
function likeAndFollow(range) {
    //获取
    const height = (device.height / 2) + random(20, 50);
    const width = (device.width / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    let isreduceSimilarWorks = random(0, 50);
    if (isLike == 0) {
        click(width, height);
        sleep(50);
        click(width, height);
        log("双击喜欢")
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            click("关注", 0);
            log("点了关注");
        } else {
            // log("不是点关注的概率:"+isFollow)
        }
    }
    else {
        // log("不是点喜欢的概率:"+isLike)
    }

}

/**
 * 减少类似作品
 * 获取设备高度
 */


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
        // smlMove( (width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
        //     (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2), 30));
        smlMove(width + random(-50, 50), height + offSet,
            width + random(-50, 50), height + offSet + (videoSwipeDistance / 2), 30);
    }
    // else if (swipeCount % 2 == 0) {
    //     //双数次上滑        
    //     smlMove(width + random(-50, 50), height + offSet,
    //         width + random(-50, 50), height + offSet + (videoSwipeDistance / 2), 30);
    // }
    else {
        //单数下滑
        smlMove((width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
            (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2)), 30);
    }

}

/**
 * 日志加强
 * @param {任意对象} obj 带箭头输出任何变量
 */
function Log(obj) {
    log("--->" + obj);
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
    // log(point[3].x)

    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)]

        xxy.push(xxyy);

    }

    // log(xxy);
    gesture.apply(null, xxy);
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
};



function clickCenter(node) {
    if (node) {
        let rect = node.bounds();
        click(rect.centerX(), rect.centerY());
        return true;
    }
    else {
        log("没有找到控件!");
        return false;
    }
}

// 需要调用时取消注释
// module.exports = {
//     run: run,    //刷视频
// }
