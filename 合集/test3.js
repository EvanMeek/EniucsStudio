
// if ($app.getAppName("moe.shizuku.privileged.api") == null) {
//     alert("请下载Shizuku并按照说明连接电脑授权");
//     $app.openUrl("https://www.coolapk.com/apk/moe.shizuku.privileged.api");
//     exit();
// }
// $shell.setDefaultOptions({
//     adb: false
// });

const user = "yzl178me";
const pass = "Yangzelin995;";
test();

function test() {

    //邀请好友
    // let t1 = id("close").findOne(1000);
    // t1.click();
    //我知道了
    // click("我知道了");
    // //   let t1 = text("关注").find().get(1);
    // Log(t1);
    Over_slider(user, pass)

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
    if (!requestScreenCapture()) {
        toast("过滑块需要截图权限支持");
        exit();
    };

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
        let res = getCode(user, pass, p2).data.res;
        Log(res);

        //计算X坐标
        let x1 = parseInt(res.split("|")[0].split(",")[0]);
        let x2 = parseInt(res.split("|")[1].split(",")[0]);
        let x = M_2.centerX() + (x2 - x1);
        Log(x);

        //滑动滑块
        swipe(160, 500, x, 500, 1000);

        //回收图片
        sleep(2000);
        p1.recycle();
        p2.recycle();

    } else {
        toastLog("没有找到滑块积木")
    }

}



function Log(obj) {
    log("--->" + obj);
}