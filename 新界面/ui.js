"ui";

ui.layoutFile("./ui.xml");

ui.viewpager.setTitles(["基础设置","功能管理","参数设置"]);

var videoItems = [
    {appName: "抖呱呱", appNameColor: "#CDC5BF"},
    {appName: "鲤刷刷", appNameColor: "#CDC5BF"},
    {appName: "趣铃声", appNameColor: "#CDC5BF"},
    {appName: "酷铃声", appNameColor: "#CDC5BF"},
    {appName: "小糖糕", appNameColor: "#CDC5BF"},
    {appName: "刷宝视频", appNameColor: "#CDC5BF"},
    {appName: "快逗视频", appNameColor: "#CDC5BF"},
    {appName: "花生视频", appNameColor: "#CDC5BF"},
    {appName: "快手视频", appNameColor: "#000000"},
    {appName: "抖音视频", appNameColor: "#CDC5BF"},
    {appName: "火山视频", appNameColor: "#CDC5BF"},
    {appName: "闪电视频", appNameColor: "#CDC5BF"},
    {appName: "闪鸭视频", appNameColor: "#CDC5BF"},
    {appName: "彩蛋视频", appNameColor: "#CDC5BF"},
    {appName: "天天清理", appNameColor: "#CDC5BF"},
    {appName: "网赚红包", appNameColor: "#CDC5BF"},
];

ui.videoList.setDataSource(videoItems);


var newsItems = [
    {appName: "聚看点", appNameColor: "#CDC5BF"},
    {appName: "趣头条", appNameColor: "#CDC5BF"},
    {appName: "忆头条", appNameColor: "#CDC5BF"},
    {appName: "想  看", appNameColor: "#CDC5BF"},
    {appName: "快看点", appNameColor: "#CDC5BF"},
    {appName: "微鲤新闻", appNameColor: "#CDC5BF"},
    {appName: "点点新闻", appNameColor: "#CDC5BF"},
    {appName: "多播看看", appNameColor: "#CDC5BF"},
    {appName: "花生快讯", appNameColor: "#000000"},
    {appName: "有料看看", appNameColor: "#CDC5BF"},
    {appName: "闪电新闻", appNameColor: "#CDC5BF"},
    {appName: "欢乐新闻", appNameColor: "#CDC5BF"},
    {appName: "天天趣闻", appNameColor: "#CDC5BF"},
    {appName: "橙子快报", appNameColor: "#CDC5BF"},
    {appName: "百姓头条", appNameColor: "#CDC5BF"},
    {appName: "红包盒子", appNameColor: "#CDC5BF"},
];

ui.newsList.setDataSource(newsItems);
