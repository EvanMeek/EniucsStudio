

// test();

function test() {
    let arr = ["Auto.js Pro"];
    clearApp(arr);
}

/**
 * 打开应用
 * @param {应用名} appName 需要打开app名称
 */
function openApp(appName) {
    let openAppTimeout = 0;//超时时间
    //回到主页
    home();
    sleep(100);
    home();
    //应用名转换包名
    appName = app.getPackageName(appName);
    //打开应用
    app.launch(appName);
    //判断应用是否打开成功
    while (true) {
        if (currentPackage() == appName) {
            Log("打开app成功");
            return appName;
        } else if (openAppTimeout >= 30) {
            Log("打开app失败，超时了!!!");
            return false;
        }
        sleep(1000);
        openAppTimeout++;
    }
}

/**
 * 退出app
 * @param {应用名} appName 需要退出的应用名
 */
function killApp(appName) {
    appName = app.getPackageName(appName);
    shell('am force-stop ' + appName, true);
    Log("退出app");
};

/**
 * 清理后台所有App
 * @param {应用名数组} runAppRetain 不被清理的应用名数组,最多4个 例如 let run_app_retain = ["微信","QQ"];
 */
function clearApp(runAppRetain) {
    let isDelete;//是否清除
    let x, y1, y2;//滑动坐标
    let runAppList;//运行app列表
    let currentText;//当前app文本
    let searchDelete;//清除按钮
    Log("清理后台");
    // 回到主页
    home();
    //打开最近任务
    recents();
    sleep(1500);
    //循环滑动任务
    do {
        runAppList = className("ScrollView").findOne(3000);
        if (runAppList != null) {
            runAppList = runAppList.children();
        } else {
            home();
            break;
        }
        // Log(run_app_list);
        //遍历所有任务
        for (let i = runAppList.length - 1; i >= 0; i--) {
            //遍历需要保留的任务
            for (let j = 0; j <= runAppRetain.length; j++) {
                //当前任务和保存任务比较 true 跳过
                currentText = runAppList[i].findOne(className("TextView")).text();
                if (currentText == runAppRetain[j]) {
                    Log("跳过");
                    isDelete = false;
                    break;
                }
                isDelete = true;
            }
            //true 清除任务
            if (isDelete) {
                Log("清除任务");
                searchDelete = runAppList[i].findOne(descContains("移除"));
                // Log(search_delete);
                if (searchDelete){
                    sleep(1000);
                    searchDelete.click();
                }
                x = runAppList[i].bounds().centerX();
                y1 = runAppList[i].bounds().top;
                y2 = runAppList[i].bounds().bottom;
                swipe(x, y1, x, y2, 300);
                break;
            } else {
                Log("需要保留的任务");
            }
        }
        sleep(100);
        if (runAppList.length <= runAppRetain.length) {
            break;
        }
    } while (true);
    //结束
    home();
}

/**
 * 打开飞行模式
 */
function openFlightMode() {
    // 打开飞行模式
    new Shell().exec("su -c 'settings put global airplane_mode_on 1; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true'")
}

/**
 * 关闭飞行模式
 */
function closeFlightMode() {
    //关闭飞行模式
    new Shell().exec("su -c 'settings put global airplane_mode_on 0; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false'")
}

/**
 * 开启分屏
 * @param {应用名1} appName1 需要分屏的第一个app
 * @param {应用名2} appName2 需要分屏的第二个app
 */
function openSplitScreen(appName1, appName2) {
    //打开app1
    openApp(appName1);
    //分屏
    splitScreen();
    sleep(2000);
    // 打开app2
    home();
    sleep(500);
    //应用名转换包名
    appName2 = app.getPackageName(appName2);
    //打开应用
    app.launch(appName2);
}

/**
 * 关闭分屏模式
 * @param {应用名} appName 分屏上面的app   
 */
function closeSplitScreen(appName) {
    //回到主页
    home();
    sleep(100);
    //关闭分屏的第一个app
    killApp(appName);
    Log("退出分屏");
}

/**
 * 日志加强
 * @param {任意对象} obj 带箭头输出任何变量
 */
function Log(obj) {
    log("--->" + obj);
}

/**
 * 判断网络是否可用
 */
function isNetwork() {
    importClass(android.net.ConnectivityManager);
    var cm = context.getSystemService(context.CONNECTIVITY_SERVICE);
    var net = cm.getActiveNetworkInfo();
    log(net);
    for (var i = 0;i < 10;i++){
        if (net == null || !net.isAvailable()) {
            Log("网络连接不可用!");
        } else {
            Log("网络连接可用!");
            return true;
        }
        sleep(1000);
        return false;
    }
}

//需要调用时取消注释
module.exports = {
    openApp: openApp,                    //打开app
    killApp: killApp,                    //退出App
    clearApp: clearApp,                  //清理后台App
    openFlightMode: openFlightMode,      //打开飞行模式
    closeFlightMode: closeFlightMode,    //关闭飞行模式   
    openSplitScreen: openSplitScreen,    //打开分屏
    closeSplitScreen: closeSplitScreen,  //关闭分屏  
    Log: Log,                            //加强日志
    isNetwork:isNetwork,                 //判断网络是否可用
}
