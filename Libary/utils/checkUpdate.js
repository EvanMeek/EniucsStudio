var pjyModule = require("./pjy.js");
let pjy = new pjyModule("br9kmn4o6it9d0r0g7tg", "jR912CAWmLvcK4g9P18FgIr2XBSpYcKa");
pjy.debug = false;
/**
 * 检查更新
 */
function checkUpdate(){
    let currentVer = "V1.0.4";
    let latestVer = pjy.GetSoftwareLatestVersion(currentVer);
    // log(latestVer.code);
    if (latestVer.code !== 10304){
        toast();
        dialogs.confirm("最新版本为:"+latestVer.result.version+"，立即更新?", "不更新可能会有问题!", function(isCheck){
            if(isCheck){
                threads.start(function () {
                    // toastLog("下载文件中,请勿进行其他操作!");
                    // download(files.getSdcardPath()+"/"+latestVer.result.version.toString()+"掘金时代.apk",latestVer.result.url.toString());
                    app.openUrl(latestVer.result.url.toString());
                });
            }else{
                toast("更新呀!");
            }
        });
    }else{
        toast(latestVer.message);
    }
}

function download(filePath,url) {
    importClass('java.io.FileOutputStream');
    importClass('java.io.IOException');
    importClass('java.io.InputStream');
    importClass('java.net.MalformedURLException');
    importClass('java.net.URL');
    importClass('java.net.URLConnection');
    importClass('java.util.ArrayList');

    var url = new URL(url);
    var conn = url.openConnection(); //URLConnection
    var inStream = conn.getInputStream(); //InputStream
    var fs = new FileOutputStream(filePath); //FileOutputStream
    var connLength = conn.getContentLength(); //int
    var buffer = util.java.array('byte', 1024); //byte[]
    var byteSum = 0; //总共读取的文件大小
    var byteRead; //每次读取的byte数
    var w
    log('要下载的文件大小=');
    log(connLength);
    var threadId = threads.start(function () {
        w = floaty.rawWindow(
            // <vertical gravity="bottom" w="*" h="*">

            // </vertical>
            <frame w="800px" h="1000px" >
                <horizontal layout_gravity="bottom" gravity="bottom" bg="#ffcc00" h="auto">
                    <text textSize="18sp">下载进度</text>
                    <text textSize="18sp" id="progressNum">
                        0
                      </text>
                </horizontal>
            </frame>
        );
        while (1) {
            var 当前写入的文件大小 = byteSum;
            var progress = (当前写入的文件大小 / connLength) * 100;
            if (progress > 0.1) {
                var progress = parseInt(progress).toString() + '%';
                ui.run(function () {
                    w.progressNum.setText(progress);
                });
                if (当前写入的文件大小 >= connLength) {
                    break;
                }
            }
            sleep(1000);
        }
    });
    while ((byteRead = inStream.read(buffer)) != -1) {
        byteSum += byteRead;
        //当前时间
        currentTime = java.lang.System.currentTimeMillis();
        fs.write(buffer, 0, byteRead); //读取
    }
    threadId && threadId.isAlive() && threadId.interrupt();
    toastLog('下载完成');
    w.close();

    app.viewFile(filePath);
}


module.exports = {
    checkUpdate:checkUpdate
};