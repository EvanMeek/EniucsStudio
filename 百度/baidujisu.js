
test();


function test() {

   run(120);
}

function run(totalTime) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    totalTime += random(-60, 180);
    log("计划时长：" + totalTime)
    let watchTime = 0;
   
    start();
    for (let i = 1; totalTime > watchTime; i++) {
        let waitTime = perVideoWatchTime + random(-2, 4)
        // log("本视频观看时长" + waitTime);

        sleep(waitTime / 2 * 1000);

        likeAndFollow(20);
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        // log("已看：" + i + "个视频 " + watchTime + "秒");
        swipeVideo(i);
    }
    log("本次观看时长" + watchTime + "秒");
}

function popUp() {
    if (textContains("升级")) {
        clickCenter(desc("关闭"));
    }
}

function mainArea(){
    let timeCount = 0;
    while (timeCount <= 10) {
        if (id("bf2").text("我的").findOne(1500)) {
            // Log("找到主界面");
            break;
        } else {
            back();
            sleep(1000);
            timeCount++;
            // toastLog("检测不到主界面");
        }
    }
}

function start() {
    mainArea();
    clickCenter(text("好看视频"));

    clickCenter(text("小视频"));

    clickCenter(id("avp"));

}

function likeAndFollow(range) {
    //获取
    const height = (device.height / 2) + random(20, 50);
    const width = (device.width / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
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

function clickCenter(node, time) {

    if (time == undefined) {
        time = 1000;
    }
    node = node.findOne(time);

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