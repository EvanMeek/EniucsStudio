

test();

function test() {

    //邀请好友
    // let t1 = id("close").findOne(3000);
    // t1.click();
    //我知道了
    // click("我知道了");
    // //   let t1 = text("关注").find().get(1);
    // Log(t1);
    // if ($app.getAppName("moe.shizuku.privileged.api") == null) {
    //     alert("请下载Shizuku并按照说明连接电脑授权");
    //     $app.openUrl("https://www.coolapk.com/apk/moe.shizuku.privileged.api");
    //     exit();
    // }
    // $shell.setDefaultOptions({
    //     adb: false
    // });
    // Log($shell("input swipe 500 300 500 700 300"));
    // let tt = className("android.widget.Image").depth(12).find().get(1).bounds();
    // let x1 = tt.left * 1.09;
    // let y1 = tt.top * 1.09;
    // let x2 = tt.right * 0.83;
    // let y2 = tt.bottom * 0.98;
    // Log(x1);
    // Log(y1);
    // Log(x2);
    // Log(y2); 
    // Log(tt);
    photo();
    // var json = '{"key":"value","jian":"zhi"}';
    // var obj = JSON.parse(json);

    // var str = JSON.stringify(obj);
    // console.log(str);
    // let t = {
    //     "data":{"res":"11,22|33,44"}
    // }
    // Log(t.data.res.split("|")[0].split(",")[0]);


}

function photo() {
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    };
    let user = "yzl178me";
    let pass = "Yang2zelin995;";
    //获取截图
    let p1 = images.captureScreen();
    p1 = images.rotate(p1, 180);
    Log(p1);
    //找到滑块区域控件
    let tt = className("android.widget.Image").findOne(1000).bounds();
    Log(tt);
    //截取滑块验证区域
    let p2 = images.clip(p1, tt.left, tt.top, tt.width(), tt.height());
    Log(p2);
    // images.save(p2, "/sdcard/test.png");
    
    //调用联众
    // let x1 = parseInt(getCode(user, pass, p2).data.res.split("|")[0].split(",")[0]);
    // let x2 = parseInt(getCode(user, pass, p2).data.res.split("|")[1].split(",")[1]);
        // var lz = JSON.parse(getCode(user, pass, p2));
        // Log(lz);
    let x = getCode(user, pass, p2).;
    // console.log(typeof str);
    // Log(getCode(user, pass, p2));
    // var test = getCode(user, pass, p2);
    // Log(x1);
    // Log(x2);
    // swipe(160,500,x2,500,1500);
    sleep(2000);
    p1.recycle();
    p2.recycle();

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


function Log(obj) {
    log("--->" + obj);
}