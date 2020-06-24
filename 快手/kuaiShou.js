// // 快手刷视频
var debugBool = true;
const _user = "yzl178me";
const _pass = "Yangzelin995;";
let overSliderCount = 0;

//请求截图权限
// if (!requestScreenCapture()) {
//     toast("过滑块需要截图权限支持");
//     exit();
// };
// test();

// ////// 当调用moudle.export时,以上代码全部注释 //////
// ////////////////////////////////////////////////////


function test() {
    let tt = depth(5).findOne(30000)
    if(tt){
        Log("当前应用包名为"+tt.packageName());
    }
    // signIn();
    // cleanCache();
    // run(12);

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
function run(totalTime, boolLikeAndFollow) {
    const perVideoWatchTime = 5;//每隔视频观看10秒
    totalTime = totalTime * 60; //把分钟转换为秒数
    totalTime += random(-60, 180);
    Log("计划时长：" + totalTime)
    let watchTime = 0;
    //清理缓存
    cleanCache();
    menuArea();
    for (let i = 1; totalTime > watchTime; i++) {
        overSlider(_user, _pass);
        blackScreenBrushVideo(i);
        let waitTime = perVideoWatchTime + random(-2, 4)
        // Log("本视频观看时长" + waitTime);
        sleep(waitTime / 2 * 1000);
        likeAndFollow(20, boolLikeAndFollow);
        skipAtlas();
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        // Log("已看：" + i + "个视频 " + watchTime + "秒");
    }
    // overSliderThred.interrupt();
    Log("本次观看时长" + watchTime + "秒");
}

/**
 * 减少类似作品
 * 获取设备高度
 */

function reduceSimilarWorks() {
    Log("开始减少类似作品");
    //获取获取坐标然后长按
    let x = device.width / 2;
    x = random((x - 100), (x + 100));
    let y = device.height / 2;
    x = random((x - 150), (x + 150));
    press(x, y, 2000);
    //随机选择4个选项
    let choice = random(0, 3);
    sleep(1000);
    if (choice == 0) {
        click("作品质量差");
    } else if (choice == 1) {
        click("不看该作者");
    } else if (choice == 2) {
        click("看过类似作品");
    } else {
        click("作品引起不适");
    }
}

function blackScreenBrushVideo(i) {
    let node;
    node =
        id("com.kuaishou.nebula:id/slide_play_view_pager").findOne(1000);
    if (node) {
        swipeVideo(i);
        sleep(1000);
        node.scrollForward();
    } else {
        Log("滑动");
        swipeVideo(1);
    }
}

/**
 * 跳过图集
 */
function skipAtlas() {
    if (textContains("点击打开").findOne(1000)) {
        Log("跳过图片");
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

    //滑出侧边栏
    // swipe(0, 500, random(400, 600), random(400, 500), 200);
    clickCenter(id("left_btn"),3000);
    //判断侧边栏是否打开
    let set_Btn = text("设置").findOne(3000);
    if (set_Btn) {
        sleep(500);
        click("设置");
    } else {
        return 1;
    }
    sleep(1000);
    //找到清理缓存并点击
    let clean_cache_Btn = text("清除缓存").findOne(30000);
    if (clean_cache_Btn) {
        sleep(500);
        clean_cache_Btn.parent().parent().click();
        sleep(1000);
        if (textContains("深度清理").findOne(1000)) {
            sleep(500);
            click("清除缓存");
        }
        Log("清理缓存中");

        sleep(1500);
    } else {
        Log("检测超时，退出清理缓存");
    }
    menuArea();
    // Log(clean_cache_Btn);
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
    if (text("拖动滑块").findOne(500) && overSliderCount < 8) {
        let overSliderthread = threads.start(function () {
            sleep(3000);
            //找到滑块区域控件
            let startX, startY;
            startY = textContains("向右拖动滑块").findOne(1500);
            if(startY){
                startY = startY.bounds().centerY();
            }
            else{
                return;
            }
            let sliderArea = className("android.view.View").depth(13).findOne(1000);
            if (sliderArea) {
                //找到滑块验证区域范围
                sliderArea = sliderArea.parent().bounds();
                Log(sliderArea);

                // 找到积木控件范围
                let slideBlock = className("android.widget.Image").depth(13).find();
                if (slideBlock.length == 2) {
                    slideBlock = slideBlock.get(1).bounds();
                    startX = slideBlock.centerX();
                    Log(slideBlock);
                } else {
                    return;
                }

                //获取截图
                let p1 = images.captureScreen();
                p1 = images.rotate(p1, 180);
                Log(p1);
                //截取滑块验证区域
                let p2 = images.clip(p1, sliderArea.left, sliderArea.top, sliderArea.width(), sliderArea.height());
                Log(p2);

                //对接联众
                let pointData = getCode(usr, pass, p2);
                if (pointData.data.res) {
                    pointData = pointData.data.res;
                    Log(pointData);

                } else {
                    Log(JSON.stringify(pointData));
                    return 0;
                }

                //计算X坐标
                let x2 = pointData.split("|")[1];
                let x1;
                let x;
                if (x2 != undefined) {
                    x2 = x2.split(",")[0];
                    // Log(x2);
                    x1 = pointData.split("|")[0].split(",")[0];
                    x = slideBlock.centerX() + (x2 - x1);
                } else {
                    x2 = pointData.split("|")[0].split(",")[0];
                    x = slideBlock.centerX() + (x2 - 55);
                }
                Log(x);

                //滑动滑块
                swipe(startX, (startY + random(0, 10)), x - 5, (startY + random(0, 10)), random(1000,1500));

                //回收图片
                sleep(2000);
                p1.recycle();
                p2.recycle();


            } else {
                toastLog("没有找到滑块积木")
            }
        })
        overSliderthread.join(30000)
        overSliderthread.interrupt();
    }
    else if (overSliderCount >= 8) {
        back();
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
    menuArea();
    Log("开始签到");
    //判断侧边栏是否打开
    //滑出侧边栏
    // swipe(0, 500, random(400, 600), random(400, 500), 200);
    clickCenter(id("left_btn"),3000);
    let moneyBtn = text("去赚钱").findOne(3000);
    if (moneyBtn) {
        sleep(500);
        click("去赚钱");
    } else {
        return 1;
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
                menuArea();
            } else {
                Log("已经签到过了");
                menuArea();
            }
        }

    } else {
        Log("检测超时,退出签到");
        menuArea();
    }
}

/**
 * 处理弹窗
 * 1. 我知道了
 * 2. 邀请好友
 * 3. 应用未响应
 */
function popUpEvent() {

    if (text("我知道了").findOnce()) {
        sleep(300);
        click("我知道了");
    }
    else if (textContains("邀请").findOnce()) {
        sleep(300);
        back();
    }
    else if (textContains("没有响应").findOnce()) {
        sleep(1000);
        click("等待");
    }
    else if (text("知道了").findOnce()) {
        sleep(300);
        click("知道了");
    }
    else if (text("立即更新").findOnce()) {
        sleep(300);
        back();
    }
    else if (textContains("升级").findOnce()) {
        sleep(1000);
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
    while (timeCount <= 10) {
        if (id("slide_right_btn").findOne(1500)) {
            // Log("找到主界面");
            break;
        } else {
            if (text("拖动滑块").findOne(500)) {
                let overSliderthread = threads.start(function () {
                    sleep(3000);
                    overSlider(_user, _pass);
                });
                overSliderthread.join(30000);
                overSliderthread.interrupt();
            }
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
    else if (swipeCount == 1) {
        smlMove((width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
            (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2)), 30);
    }
    else {
        //单数下滑
        // smlMove((width - random(-50, 50)), (height + offSet + (videoSwipeDistance / 2)),
        //     (width + random(-50, 50)), (height + offSet - (videoSwipeDistance / 2)), 30);
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
    //获取
    const height = (device.height / 2) + random(20, 50);
    const width = (device.width / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    let isreduceSimilarWorks = random(0, 30);
    if (isLike == 0) {
        swipeVideo(1);
        sleep(1000);
        click(width, height);
        sleep(50);
        click(width, height);
        Log("双击喜欢");
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            swipeVideo(1);
            sleep(1000);
            let follow = text("关注").find();
            if (follow) {
                click("关注");
            }
            Log("点了关注");
        } else {
            // Log("不是点关注的概率:"+isFollow)
        }
        blackScreenBrushVideo(1);
    }
    else if (isreduceSimilarWorks == 4) {
        //减少类似作品
        swipeVideo(1);
        sleep(1500);
        reduceSimilarWorks();
        sleep(1000);
        blackScreenBrushVideo(1);
    }
    else {
        // Log("不是点喜欢的概率:"+isLike)
    }


}

/**
 * 获取联众返回
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
            softwareSecret: "LXgAa7NbYVCeVDsOXwqc01Hsqza5JIKYxVt5XNFS",//这里换成自己的软件 Secret
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
 * 调用前确保已经获取截图权限
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
    run: run,    //快手刷视频
    signIn: signIn,  //快手签到
    popUpEvent: popUpEvent,  //快手弹窗
}

