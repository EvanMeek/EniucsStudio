
// test();


// function test() {
    
//    run(120);
// }

// function run(totalTime) {
//     const perVideoWatchTime = 5;//每隔视频观看10秒
//     totalTime += random(-60, 180);
//     log("计划时长：" + totalTime)
//     let watchTime = 0;
//     start();
//     for (let i = 1; totalTime > watchTime; i++) {
//         let waitTime = perVideoWatchTime + random(-2, 4)
//         // log("本视频观看时长" + waitTime);
//         if(!id("single_friend").findOne(1000)){
//             clickCenter(id("play_btn"));
//         }
        
//         sleep(waitTime / 2 * 1000);
  

//         sleep(waitTime / 2 * 1000);
//         watchTime += waitTime;

//     }
//     log("本次观看时长" + watchTime + "秒");
// }

// function start() {
// let is;

//     clickCenter(text("我的"), 30000)

//     clickCenter(text("看视频 领现金"),3000);

//     is = clickCenter(text("去签到"),10000);

//     if(is){
//         clickCenter(text("确定"),3000);
//     }
   

//     let openBox = text("开宝箱").find();
//     if (openBox.length >= 2) {
//         let rect = openBox[1].bounds();
//         click(rect.centerX(), rect.centerY());
//         clickCenter(text("确定"),3000);
//     }

//     clickCenter(id("forward-wrap"));
// }

// function clickCenter(node, time) {

//     if (time == undefined) {
//         time = 1000;
//     }
//     node = node.findOne(time);

//     if (node) {
//         let rect = node.bounds();
//         click(rect.centerX(), rect.centerY());
//         return true;
//     }
//     else {
//         log("没有找到控件!");
//         return false;
//     }
// }