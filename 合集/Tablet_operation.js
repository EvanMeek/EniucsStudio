



test();
function test() {
    var arr = [];
    clear_app(arr);
    Log("err");
}

function 打开飞行模式() {
    // 打开飞行模式
    new Shell().exec("su -c 'settings put global airplane_mode_on 1; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true'")
}

function 关闭飞行模式() {
    //关闭飞行模式
    new Shell().exec("su -c 'settings put global airplane_mode_on 0; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false'")
}

// 停止APP
function kill_app(app_name) {
    /**
     * * 参数
     * 1. app_name :应用名
     * * 流程：
     * 1. 转换包名
     * 2. 调用shell关闭app
     */
    app_name = app.getPackageName(app_name);
    shell('am force-stop ' + app_name, true);
    Log("退出app");
};

function close_split_Screen(app_name){
    /**
     * * 参数
     * 1. app_name :应用名
     * * 流程：
     * 1. 回到主页
     * 2. 关闭分屏的第一个app
     */
    home();
    sleep(100);

    kill_app(app_name);
    Log("退出分屏");
}

function open_split_Screen(appname_1, appname_2) {
    /**
     * * 参数
     * 1. appname1，appname2：需要分屏的两个应用
     * * 流程
     * 1. 打开app1
     * 2. 分屏
     * 3. 打开app2
     */
    open_app(appname_1);

    sleep(1000);
    splitScreen();

    open_app(appname_2);
}

function clear_app(run_app_retain) {
    /**
     * * 注意项:
     *  参数为数组 存放保留任务的字符串 例如 let run_app_retain = ["微信","QQ"];
     *  目前最大保留4个白名单
     * * 流程:
     * 1. 返回主页
     * 2. 打开最近任务
     * 3. 获取所有任务并且遍历
     *    1. 判断是否为白名单app
     *    2. true 跳过break false 点击清理按钮并且滑动到下一个break
     *    3. 退出循环条件 所有任务 > 白名单数量
     
     */
    //是否清除
    let is_delete;
    //滑动坐标
    let x, y1, y2;
    //运行app列表
    let run_app_list;
    //当前app文本
    let current_text;
    //清除按钮
    let search_delete;
    // 回到主页
    home();
    //打开最近任务
    recents();
    sleep(1500);
    //循环滑动任务
    do {     
        run_app_list = className("ScrollView").findOne(3000);
        if (run_app_list != null){
            run_app_list = run_app_list.children();
        }else{
            home();
            break;
        }
        if (run_app_list.length == run_app_retain.length){
            break;
        }
        // Log(run_app_list);
        //遍历所有任务
        for (let i = run_app_list.length - 1; i >= 0; i--) {
            //遍历需要保留的任务
            for (let j = 0; j <= run_app_retain.length; j++) {
                //当前任务和保存任务比较 true 跳过
                current_text = run_app_list[i].findOne(className("TextView")).text();
                if (current_text == run_app_retain[j]) {
                    Log("跳过");
                    is_delete = false;
                    break;
                }
                is_delete = true;
            }
            //true 清除任务
            if (is_delete) {
                Log("清除任务");
                search_delete = run_app_list[i].findOne(descContains("移除"));
                // Log(search_delete);
                search_delete.click();
                x = run_app_list[i].bounds().centerX();
                y1 = run_app_list[i].bounds().top;
                y2 = run_app_list[i].bounds().bottom;
                swipe(x, y1, x, y2, 300);
                break;
            } else {
                Log("需要保留的任务");
            }
        }
        sleep(100);
        
    } while (true);
    //结束
    home();
}

//打开app
function open_app(app_name) {
    /**
     * * 参数
     * 1. app_name :应用名
     * * 返回值
     * 1. 应用包名
     * * 流程
     * 1. 回到主页
     * 2. 后台打开app
     * 3. 确定打开app
     */
    //回到主页
    let open_app_timeout = 0;
    home();
    sleep(100);
    home();
    //打开app
    app_name = app.getPackageName(app_name);
    app.launch(app_name);
    while (true) {
        if (currentPackage() == app_name) {
            Log("打开app成功");
            break;
        } else if (open_app_timeout >= 30) {
            Log("打开app失败，超时了!!!");
            break;
        }
        sleep(1000);
        open_app_timeout++;
    }
    return app_name;
}

function Log(obj) {
    log("--->" + obj);
}




// var kuaiShou;
// kuaiShou.Log = Log;
// kuaiShou.main = function (totalTime) {    
//     run(totalTime)
//   };
  
// 返回
// module.exports = {
//     // Llog:Log,
//     Log:Log,
//     open_app:open_app,
// }