var pjyModule = require("./pjy.js");
let pjy = new pjyModule("br9kmn4o6it9d0r0g7tg", "jR912CAWmLvcK4g9P18FgIr2XBSpYcKa");
pjy.debug = false;
/**
 * 检查更新
 */
function checkUpdate(){
    let currentVer = "V1.0.4";
    let latestVer = pjy.GetSoftwareLatestVersion(currentVer);
    log(latestVer.code);
    if (latestVer.code !== 10304){
        toast();
        dialogs.confirm("最新版本为:"+latestVer.result.version+"，立即更新?", "不更新可能会有问题!", function(isCheck){
            if(isCheck){
                threads.start(function () {
                    toastLog("下载文件中,请勿进行其他操作!");
                    downloadApp(files.getSdcardPath()+"/"+latestVer.result.version.toString()+"掘金时代.apk",latestVer.result.url.toString());
                });
            }else{
                toast("更新呀!");
            }
        });
    }else{
        toast(latestVer.message);
    }
}

module.exports = {
    checkUpdate:checkUpdate
};