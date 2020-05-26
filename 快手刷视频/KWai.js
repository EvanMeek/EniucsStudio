// 快手刷视频

const user = "yzl178me";
const pass = "Yangzelin995;";
if (!requestScreenCapture()) {
    toast("过滑块需要截图权限支持");
    exit();
};
test();
function test() {
    // swipeVideo();
    // run(100000);
    // Sign_in();
    // Over_slider(user,pass);
    // Clean_cache();
    run(1200);
    // Skip_Atlas();
}

function run(totalTime) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    log("计划时长：" + totalTime)
    let watchTime = 0;
    for (let i = 1; totalTime > watchTime; i++) {
        if (text("拖动滑块").findOne(500)) {
            Over_slider(user, pass);
        }
        Popup_1();
        let waitTime = perVideoWatchTime + random(-4, 2)

        log("本视频观看时长" + waitTime)
        sleep(waitTime / 2 * 1000);
        likeAndfollow(7);
        Skip_Atlas();
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        log("已看：" + i + "个视频 " + watchTime + "秒");
        swipeVideo(i);
        Skip_Atlas();
    }
}

function Skip_Atlas() {
    /**
     * 跳过图集
     */
    if (textContains("点击打开").findOne(500)) {
        swipeVideo(1);
        sleep(100);
        swipeVideo(1);
    }
}

function Clean_cache() {
    /**
     * 清理缓存流程 
     * 1. 回到主界面
     * 2. 找到并点击设置
     * 3. 找到签到界面(超时30秒)
     * 4. 翻到最下面找到签到按钮并判断点击或者立即签到
     */
    //回到主界面
    Menu_Window();
    Log("开始清理缓存");
    //判断侧边栏是否打开
    let A_1 = text("设置").findOne(3000);
    if (A_1) {
        sleep(500);
        A_1.parent().click();
    } else {
        id("left_btn").findOne(3000).click();
        A_1 = text("设置").findOne(3000);
        sleep(500);
        A_1.parent().click();
    }
    sleep(5000);
    //找到清理缓存并点击
    let A_2 = text("清除缓存").findOne(30000);
    if (A_2) {
        sleep(500);
        A_2.parent().parent().click();
        Log("清理缓存中");
        sleep(1500);
    } else {
        Log("检测超时，退出清理缓存");
    }
    back();
    Log(A_2);

}

function Over_slider(usr, pass) {
    /**
     * 滑块验证
     * 1. 此功能需要截图权限支持
     * 2. 找到滑块验证区域范围
     * 3. 找到积木控件范围
     * 4. 截取滑块验证区域的图片
     * 5. 对接联众平台
     * 6. 计算滑动X坐标 X = 积木中间 + 两个积木之间的距离
     * 7. 回收图片
     */
    //找到滑块区域控件
    let M_1 = className("android.widget.Image").findOne(1000);
    if (M_1) {
        //找到滑块验证区域范围
        M_1 = M_1.bounds();
        Log(M_1);

        // 找到积木控件范围
        let M_2 = className("android.widget.Image").find().get(1).bounds();
        Log(M_2);

        //获取截图
        let p1 = images.captureScreen();
        p1 = images.rotate(p1, 180);
        Log(p1);
        //截取滑块验证区域
        let p2 = images.clip(p1, M_1.left, M_1.top, M_1.width(), M_1.height());
        Log(p2);

        //对接联众
        let res_lz = getCode(usr, pass, p2);
        if (res_lz.data) {
            res_lz = res_lz.data.res;
            Log(res_lz);
        } else {
            return 0;
        }

        //计算X坐标
        let x1 = parseInt(res_lz.split("|")[0].split(",")[0]);
        let x2 = parseInt(res_lz.split("|")[1].split(",")[0]);
        let x = M_2.centerX() + (x2 - x1);
        Log(x);

        //滑动滑块
        swipe(160, (500 + random(0, 10)), x, (500 + random(-100, 100)), 1000);

        //回收图片
        sleep(2000);
        p1.recycle();
        p2.recycle();

    } else {
        toastLog("没有找到滑块积木")
    }

}

function Sign_in() {
    /**
     * 流程
     * 1. 回到主界面
     * 2. 找到并点击去赚钱
     * 3. 找到签到界面(超时30秒)
     * 4. 翻到最下面找到签到按钮并判断点击或者立即签到
     */
    //回到主界面
    Menu_Window();
    Log("开始签到");
    //判断侧边栏是否打开
    let A_1 = text("去赚钱").findOne(3000);
    if (A_1) {
        sleep(500);
        A_1.parent().click();
    } else {
        id("left_btn").findOne(3000).click();
        A_1 = text("去赚钱").findOne(3000);
        sleep(500);
        A_1.parent().click();
    }

    //进入签到界面 正常情况
    let M_1 = text("金币收益").findOne(30000);
    if (M_1) {
        Log("进入签到页面");
        //找到立即签到则直接点击后返回
        let A_3 = text("立即签到").findOne(1000);
        if (A_3) {
            A_3.click();
            sleep(500);
            back();
        } else {
            scrollDown(0);
            sleep(500);
            scrollDown(0);
            Log("滑动到最后");
            //找到去签到按钮
            let A_2 = text("去签到").findOne(1500);
            if (A_2) {
                sleep(500);
                A_2.click();
                textContains("今日已签").findOne(1500);
                sleep(500);
                Log("签到成功");
                back();
            } else {
                Log("已经签到过了");
                back();
            }
        }

    } else {
        Log("检测超时,退出签到");
        back();
    }

}

function Menu_Window() {
    let time_count = 0;
    while (time_count >= 10) {
        if (id("slide_right_btn").findOne(1500)) {
            Log("找到主界面");
        } else {
            back();
            sleep(1000);
            time_count++;
            // toastLog("检测不到主界面");
        }
    }

}


//swipeCount，滑动视频的次数
function swipeVideo(swipeCount) {
    const halfDeviceHeight = device.height / 2;
    const halfDeviceWidth = device.width / 2;
    const videoSwipeDistance = halfDeviceHeight - 100;//视频下滑的长度 px
    let offset = random(-100, 0)
    if (swipeCount % 6 == 0) {
        //  双数的第6次下滑
        sml_move(halfDeviceWidth - random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2),
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset - (videoSwipeDistance / 2), 30);
    } else if (swipeCount % 2 == 0) {
        //双数次上滑        
        sml_move(halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset,
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2), 30);

    } else {
        //单数下滑
        sml_move(halfDeviceWidth - random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2),
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset - (videoSwipeDistance / 2), 30);
    }

}

function Popup_1() {
    /**
     * 处理弹窗
     * 1. 我知道了
     * 2. 邀请好友
     * 3. 待续
     */
    if (text("我知道了").findOnce()) {
        sleep(300);
        click("我知道了");
    }
    else if (id("立即邀请").findOnce()) {
        sleep(300);
        back();
    }
}


function likeAndfollow(range) {
    /** 随机点赞或者关注
     * //有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
     * 流程
     * 1. 获取需要双击喜欢的坐标点
     * 2. 判断随机数 如果喜欢了再判断关注
     */
    const halfDeviceHeight = (depth(0).findOnce().bounds().height() / 2) + random(20, 50);
    const halfDeviceWidth = (depth(0).findOnce().bounds().width() / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    if (isLike == 0) {
        click(halfDeviceWidth, halfDeviceHeight);
        sleep(50);
        click(halfDeviceWidth, halfDeviceHeight);
        log("双击喜欢")
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            let A_1 = text("关注").find();
            if (A_1) {
                A_1[1].parent().click();
            }
            log("点了关注");
        } else {
            // log("不是点关注的概率:"+isFollow)
        }
    } else {
        // log("不是点喜欢的概率:"+isLike)
    }

}

function Log(obj) {
    log("--->" + obj);
}

function getCode(username, password, img) {
    http.__okhttp__.setTimeout(3e4);
    var r = images.toBase64(img, format = "png"), i = device.release, c = device.model, s = device.buildId;
    try {
        var n = http.postJson("https://v2-api.jsdama.com/upload", {
            softwareId: 19684,
            softwareSecret: "LXgAa7NbYVCeVDsOXwqc01Hsqza5JIKYxVt5XNFS",
            username: username,
            password: password,
            captchaData: r,
            captchaType: 1310,
            captchaMinLength: 0,
            captchaMaxLength: 0,
            workerTipsId: 0
        }, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android " + i + "; " + c + " Build/" + s + "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 Mobile Safari/537.36",
            }
        });
    } catch (e) {
        return {
            code: "-1",
            msg: "网络链接超时...",
            data: {}
        };
    }
    var d = n.body.json(), p = d.code, m = d.message;
    if ("10079009" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142006" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142004" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142005" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10079006" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("0" == p) {
        return {
            code: p,
            msg: m,
            data: {
                res: d.data.recognition
            }
        };
    }
    return d;
}

/**
 * 仿真随机带曲线滑动  (视频滑动)
 * @param {起点x} qx 
 * @param {起点y} qy 
 * @param {终点x} zx 
 * @param {终点y} zy 
 * @param {过程耗时单位毫秒} time 
 */
function sml_move(qx, qy, zx, zy, time) {
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
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]

        xxy.push(xxyy);

    }

    // log(xxy);
    gesture.apply(null, xxy);
};

function bezier_curves(cp, t) {
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

