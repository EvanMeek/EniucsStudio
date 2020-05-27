// 快手刷视频

const _user = "yzl178me";
const _pass = "Yangzelin995;";

//请求截图权限
if (!requestScreenCapture()) {
    toast("过滑块需要截图权限支持");
    exit();
};
test();

////// 当调用moudle.export时,以上代码全部注释 //////
////////////////////////////////////////////////////


function test() {
    // swipeVideo();
    // run(100000);
    // Sign_in();
    // Over_slider(user,pass);
    // Clean_cache();
    run(12000,_user,_pass);
    // overSlider(_user, _pass);
    // Skip_Atlas();
}

/**
 * 刷视频流程 
 * @param {总时长} totalTime 刷快手视频的总时长
 * 1. 请确定已经在此之前调用过 请求截图权限
 * 2. 初始化观看时间
 * 3. 进入循环刷视频操作
 *   1. 判断滑块
 *   2. 判断弹窗事件
 *   3. 获取随机观看时间
 *   4. 等待期间进行随机点赞关注和检查图集
 *   5. 滑动刷视频
 *   6. 检查图集
 * 4. 刷视频完成
 */
function run(totalTime,user,pass) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    log("计划时长：" + totalTime)
    let watchTime = 0;
    for (let i = 1; totalTime > watchTime; i++) {
        if (text("拖动滑块").findOne(500)) {
            overSlider(user, pass);
        }
        //判断弹窗事件
        popUpEvent();
        let waitTime = perVideoWatchTime + random(-4, 2)

        log("本视频观看时长" + waitTime)
        sleep(waitTime / 2 * 1000);
        likeAndFollow(7);
        skipAtlas();
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        log("已看：" + i + "个视频 " + watchTime + "秒");
        swipeVideo(i);
        skipAtlas();
    }
}

/**
 * 跳过图集
*/
function skipAtlas() {
    if (textContains("点击打开").findOne(500)) {
        swipeVideo(1);
        sleep(100);
        swipeVideo(1);
    }
}

/**
 * 清理快手缓存
 * 1. 回到主界面
 * 2. 找到并点击设置
 * 3. 找到签到界面(超时30秒)
 * 4. 翻到最下面找到签到按钮并判断点击或者立即签到
 */
function cleanCache() {
    //回到主界面
    menuArea();
    Log("开始清理缓存");
    //判断侧边栏是否打开
    let set_Btn = text("设置").findOne(3000);
    if (set_Btn) {
        sleep(500);
        set_Btn.parent().click();
    } else {
        id("left_btn").findOne(3000).click();
        set_Btn = text("设置").findOne(3000);
        sleep(500);
        set_Btn.parent().click();
    }
    sleep(5000);
    //找到清理缓存并点击
    let clean_cache_Btn = text("清除缓存").findOne(30000);
    if (clean_cache_Btn) {
        sleep(500);
        clean_cache_Btn.parent().parent().click();
        Log("清理缓存中");
        sleep(1500);
    } else {
        Log("检测超时，退出清理缓存");
    }
    back();
    Log(clean_cache_Btn);

}

/**
 * 滑块验证
 * @param {用户名} usr 联众用户名
 * @param {密码} pass 联众密码
 * 1. 此功能需要截图权限支持
 * 2. 找到滑块验证区域范围
 * 3. 找到积木控件范围
 * 4. 截取滑块验证区域的图片
 * 5. 对接联众平台
 * 6. 计算滑动X坐标 X = 积木中间 + 两个积木之间的距离
 * 7. 回收图片
 */
function overSlider(usr, pass) {
    //找到滑块区域控件
    let sliderArea = className("android.widget.Image").findOne(1000);
    if (sliderArea) {
        //找到滑块验证区域范围
        sliderArea = sliderArea.bounds();
        Log(sliderArea);

        // 找到积木控件范围
        let slideBlock = className("android.widget.Image").find().get(1).bounds();
        Log(slideBlock);

        //获取截图
        let p1 = images.captureScreen();
        p1 = images.rotate(p1, 180);
        Log(p1);
        //截取滑块验证区域
        let p2 = images.clip(p1, sliderArea.left, sliderArea.top, sliderArea.width(), sliderArea.height());
        Log(p2);

        //对接联众
        let pointData = getCode(usr, pass, p2);
        if (pointData.data) {
            pointData = pointData.data.res;
            Log(pointData);
        } else {
            Log(JSON.stringify(pointData));
            return 0;
        }

        //计算X坐标
        let x1 = parseInt(pointData.data.res.split("|")[0].split(",")[0]);
        let x2 = parseInt(pointData.data.res.split("|")[1].split(",")[0]);
        let x = slideBlock.centerX() + (x2 - x1);
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

/**
 * 快手签到
 * 1. 回到主界面
 * 2. 找到并点击去赚钱
 * 3. 找到签到界面(超时30秒)
 * 4. 翻到最下面找到签到按钮并判断点击或者立即签到
 */
function signIn() {

    //回到主界面
    menuArea();
    Log("开始签到");
    //判断侧边栏是否打开
    let moneyBtn = text("去赚钱").findOne(3000);
    if (moneyBtn) {
        sleep(500);
        moneyBtn.parent().click();
    } else {
        id("left_btn").findOne(3000).click();
        moneyBtn = text("去赚钱").findOne(3000);
        sleep(500);
        moneyBtn.parent().click();
    }

    //进入签到界面 正常情况
    let profit = text("金币收益").findOne(30000);
    if (profit) {
        Log("进入签到页面");
        //找到立即签到则直接点击后返回
        let signInNowBtn = text("立即签到").findOne(1000);
        if (signInNowBtn) {
            signInNowBtn.click();
            sleep(500);
            back();
        } else {
            scrollDown(0);
            sleep(500);
            scrollDown(0);
            Log("滑动到最后");
            //找到去签到按钮
            let checkInBtn = text("去签到").findOne(1500);
            if (checkInBtn) {
                sleep(500);
                checkInBtn.click();
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

/**
 * 找到主界面
 * 1. 添加计时器 10秒
 * 2. 找到主界面按钮
 */
function menuArea() {
    let timeCount = 0;
    while (timeCount >= 10) {
        if (id("slide_right_btn").findOne(1500)) {
            Log("找到主界面");
        } else {
            back();
            sleep(1000);
            timeCount++;
            // toastLog("检测不到主界面");
        }
    }

}

/**
 * 滑动视频
 * @param {滑动次数} swipeCount 
 * 1. 获取宽高
 * 2. 单数下滑,双数下滑,swipeCount % 6 == 0 下滑
 */
function swipeVideo(swipeCount) {
    const height = device.height / 2;
    const width = device.width / 2;
    const videoSwipeDistance = height - 100;//视频下滑的长度 px
    let offSet = random(-100, 0)
    if (swipeCount % 6 == 0) {
        //  双数的第6次下滑
        smlMove(width - random(-50, 50), height + offSet + (videoSwipeDistance / 2),
            width + random(-50, 50), height + offSet - (videoSwipeDistance / 2), 30);
    } else if (swipeCount % 2 == 0) {
        //双数次上滑        
        smlMove(width + random(-50, 50), height + offSet,
            width + random(-50, 50), height + offSet + (videoSwipeDistance / 2), 30);

    } else {
        //单数下滑
        smlMove(width - random(-50, 50), height + offSet + (videoSwipeDistance / 2),
            width + random(-50, 50), height + offSet - (videoSwipeDistance / 2), 30);
    }

}

/**
 * 处理弹窗
 * 1. 我知道了
 * 2. 邀请好友
 */
function popUpEvent() {

    if (text("我知道了").findOnce()) {
        sleep(300);
        click("我知道了");
    }
    else if (id("立即邀请").findOnce()) {
        sleep(300);
        back();
    }
}

/**
 * 随机点赞或者关注
 * @param {点赞概率} range 有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
 * 1. 获取需要双击喜欢的坐标点
 * 2. 判断随机数 如果喜欢了再判断关注
 */
function likeAndFollow(range) {
    //获取
    const height = (depth(0).findOnce().bounds().height() / 2) + random(20, 50);
    const width = (depth(0).findOnce().bounds().width() / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    if (isLike == 0) {
        click(width, height);
        sleep(50);
        click(width, height);
        log("双击喜欢")
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            let follow = text("关注").find();
            if (follow) {
                follow[1].parent().click();
            }
            log("点了关注");
        } else {
            // log("不是点关注的概率:"+isFollow)
        }
    } else {
        // log("不是点喜欢的概率:"+isLike)
    }

}

//以下函数可通用

/**
 * 日志加强
 * @param {任意对象} obj 带箭头输出任何变量
 */
function Log(obj) {
    log("--->" + obj);
}

/**
 * 
 * @param {用户名}} username 
 * @param {密码} password 
 * @param {图片} img 
 */
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

//需要调用时取消注释
// model.export = {
//     run:run,    //单个快手流程
// }
