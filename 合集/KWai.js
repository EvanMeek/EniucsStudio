// 快手刷视频

const perVideoWatchTime = 5;//每隔视频观看10秒
const halfDeviceHeight = device.height / 2;
const halfDeviceWidth = device.width / 2;
const videoSwipeDistance = halfDeviceHeight - 100;//视频下滑的长度 px

test();
function test() {
    // swipeVideo();
    // run(100000);
    // Sign_in();
   


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

function run(totalTime) {
    log("计划时长：" + totalTime)
    launchApp();
    let watchTime = 0;
    for (let i = 1; totalTime > watchTime; i++) {
        if (text("拖动滑块").findOnce()) {
            log("出现验证码，结束")
            runOver();
            break;
        }
        let waitTime = perVideoWatchTime + random(-4, 4)
        log("本视频观看时长" + waitTime)
        sleep(waitTime / 2 * 1000);
        likeAndfollow(7);
        sleep(waitTime / 2 * 1000);
        watchTime += waitTime;
        log("已看：" + i + "个视频 " + watchTime + "秒");
        swipeVideo(i);

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
        swipe(halfDeviceWidth - random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2),
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset - (videoSwipeDistance / 2), 30);
    } else if (swipeCount % 2 == 0) {
        //双数次上滑        
        swipe(halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset,
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2), 30);

    } else {
        //单数下滑
        swipe(halfDeviceWidth - random(-50, 50), halfDeviceHeight + offset + (videoSwipeDistance / 2),
            halfDeviceWidth + random(-50, 50), halfDeviceHeight + offset - (videoSwipeDistance / 2), 30);
    }

}

function Popup_1() {
    /**
     * 处理我知道了弹窗
     * 找到并点击
     */
    if (text("我知道了").findOne(500)) {
        click("我知道了");
    }
}

function likeAndfollow(range) {
    /** 随机点赞或者关注
     * //有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
     * 流程
     * 1. 获取需要双击喜欢的坐标点
     * 2. 判断随机数 如果喜欢了再判断关注
     */
    const halfDeviceHeight = (device.height / 2) + random(20, 50);
    const halfDeviceWidth = (device.width / 2) + random(20, 50);
    let isLike = random(-1 * range, range);
    if (isLike == 0) {
        click(halfDeviceWidth, halfDeviceHeight);
        sleep(50);
        click(halfDeviceWidth, halfDeviceHeight);
        log("双击喜欢")
        let isFollow = random(-1 * range, range);
        if (isFollow == 0) {
            text("关注").click();
            log("点了关注");
        } else {
            // log("不是点关注的概率:"+isFollow)
        }
    } else {
        // log("不是点喜欢的概率:"+isLike)
    }

}
//是否已经不再有收益了
function isNoIncome() {
    let isIncome = findIncomeIcon()
    if (!isIncome) {
        sleep(6000)
        isIncome = findIncomeIcon()
        if (!isIncome) {
            log("等待6秒，不见收益红包")
            return false
        }
    }
    log("正在收益中")
    return true;
}
//查找收入红包的图标，是收益中的返回true 否则返回false
function findIncomeIcon() {
    let redBag = id(" com.kuaishou.nebula:id/circular_progress_bar").findOnce()
    if (redBag) {
        let redBagBounds = redBag.bounds()
        let screen = images.captureScreen();
        // log(redBagBounds)
        let p = images.findColorEquals(screen, "#f85050", redBagBounds.left, redBagBounds.top, redBagBounds.width(), redBagBounds.height())
        return p ? true : false;
    }
    return false;
}
function runOver() {
    home()
}

function Log(obj) {
    log("--->" + obj);
}