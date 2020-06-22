let uiBaseClick = require("../Libary/uiBase/CLICK.js");

function test() {

}
/**
 * 处理弹窗
 */
function popupWindow(){
    threads.start(function(){
        while(true){
            let initPopupWindow = text("先去逛逛");
            if(uiBaseClick.clickCenterBySelector(initPopupWindow,5000,2)){
                log("快看点---已跳过新人福利弹窗。");
            }
            sleep(3000);
        }
    });
}


test();