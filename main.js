"ui";
// 本程序未加密，如果你尝试反编译学习，非常欢迎。但是你要是拿去倒卖，你全家死光光。
var timeout_date = new Date(2020, 5, 5, 12, 00, 00);
var now_date = new Date();
const _user = "yzl178me";
const _pass = "Yangzelin995;";
let Apparr = ["Auto.js Pro", "合集"];	//不被清理的应用数组,通用
var menu_color = "#000000";
var tabletOperation = require("./Libary/平板操作/tabletOperation.js");

let ViewIdListRegisterListener = require("./Libary/utils/saveUIConfig.js");
ui.layoutFile("./main.xml");
// 初始化UI;
initUI();

//获取UI信息
var flyModeStat = ui.swFlyModeBtn.isChecked();
// var signInStat = ui.kWaiSignInBtn.isChecked();
// var cleanCacheStat = ui.kWaiCleanCacheBtn.isChecked();
// 初始化权限;
initPermissionThread = threads.start(function() {
	initPermission();
});

// 点击开始后要做的事
ui.runAllBtn.on("click", () => {
	log("runAllBtn");
	threads.start(function() {
		if (now_date > timeout_date) {
			toast("应用已过期，请购买永久版本!");
		} else {
			toast("脚本即将启动");
			main();
		}
	});
});


var mainThread = threads.currentThread();

mainThread.setTimeout(function() {
	saveConfig();
}, 500);

/**
 * 主函数
 */
function main() {
	// 等待线程完成之后杀死初始化权限线程
	initPermissionThread.join(60000);
	initPermissionThread.interrupt();

	//快手极速版
	if (ui.swBtn.isChecked()) {
		kwai();
	}
	//抖音短视频
	if (ui.swBtn2.isChecked()) {
		// douyin();
	}
}

/**
 * 初始化UI
 */
function initUI() {
	// ui.tabs.setupWithViewPager(ui.viewpager);
	// ui.emitter.on("create_options_menu", (menu) => {
	// 	menu.add("日志");
	// 	menu.add("关于");
	// });
	// ui.emitter.on("options_item_selected", (e, item) => {
	// 	switch (item.getTitle()) {
	// 	case "日志":
	// 	    app.startActivity("console");
	// 	    break;
	// 	}
	// });
	ui.viewpager.setTitles(["基础设置", "功能管理", "参数设置"]);
	ui.appTypeViewPager.setTitles(["视频播放类", "新闻阅读类"]);
	var videoItems = [
		{ appName: "快手视频", appNameColor: "#000000", appSwitchBtn: "swKuaiShou", appRunTimeInput: "kuaiShouTime" },
		{ appName: "微视视频", appNameColor: "#000000", appSwitchBtn: "swWeiShi", appRunTimeInput: "weiShiTime" },
		{ appName: "抖呱呱", appNameColor: "#CDC5BF", appSwitchBtn: "swDouGuaGua", appRunTimeInput: "douGuaGuaTime" },
		{ appName: "鲤刷刷", appNameColor: "#CDC5BF", appSwitchBtn: "swLiShuaShua", appRunTimeInput: "liShuaShuaTime" },
		{ appName: "趣铃声", appNameColor: "#CDC5BF", appSwitchBtn: "swQuLingSheng", appRunTimeInput: "quLingShengTime" },
		{ appName: "酷铃声", appNameColor: "#CDC5BF", appSwitchBtn: "swKuLingSheng", appRunTimeInput: "kuLingShengTime" },
		{ appName: "小糖糕", appNameColor: "#CDC5BF", appSwitchBtn: "swXiaoTangGao", appRunTimeInput: "xiaoTangGaoTime" },
		{ appName: "刷宝视频", appNameColor: "#CDC5BF", appSwitchBtn: "shuaBao", appRunTimeInput: "shuaBaoTime" },
		{ appName: "快逗视频", appNameColor: "#CDC5BF", appSwitchBtn: "kuaiDou", appRunTimeInput: "kuaiDouTime" },
		{ appName: "花生视频", appNameColor: "#CDC5BF", appSwitchBtn: "huaSheng", appRunTimeInput: "huaShengTime" },
		{ appName: "抖音视频", appNameColor: "#CDC5BF", appSwitchBtn: "douYin", appRunTimeInput: "douYinTime" },
		{ appName: "火山视频", appNameColor: "#CDC5BF", appSwitchBtn: "huoShan", appRunTimeInput: "huoShanTime" },
		{ appName: "闪电视频", appNameColor: "#CDC5BF", appSwitchBtn: "shanDian", appRunTimeInput: "shanDianTime" },
		{ appName: "闪鸭视频", appNameColor: "#CDC5BF", appSwitchBtn: "shanYa", appRunTimeInput: "shanYaTime" },
		{ appName: "彩蛋视频", appNameColor: "#CDC5BF", appSwitchBtn: "caiDan", appRunTimeInput: "caiDanTime" },
		{ appName: "天天清理", appNameColor: "#CDC5BF", appSwitchBtn: "tianTian", appRunTimeInput: "tianTianTime" },
		{ appName: "网赚红包", appNameColor: "#CDC5BF", appSwitchBtn: "wangZhuan", appRunTimeInput: "wangZhuanTime" },
	];
	ui.videoList.setDataSource(videoItems);
}

/**
 * 快手
 * @UI ID如下:
 * 首页按钮: runAllBtn
 * 功能管理: 快手刷视频-swBtn 抖音刷视频-swBtn2
 * 功能参数: 刷视频时间-kwaiRunTimeInput 飞行模式-kWaiFlyModeBtn 签到-kWaiSignInBtn 清理缓存-kWaiCleanCacheBtn
 */
function kwai() {
	var kwaiMain = require("./快手刷视频/kuaishou.js"); //导入快手js文件

	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = ui.switchAccountBegin.text(); i < ui.switchAccountEnd.text(); i++) {

		//清理后台App(平台专属)
		tabletOperation.clearApp(Apparr);
		sleep(1000);

		//飞行模式
		if (flyModeStat) {
			tabletOperation.openFlightMode();
			log("开启飞行模式");
			sleep(3000);
			tabletOperation.closeFlightMode();
			log("关闭飞行模式");
			//检查网络
			tabletOperation.isNetwork();
		}

		//第0个默认为原版快手,其他的按这个顺序来
		if (i == 0) {
			appName = "快手极速版";
		} else {
			appName = "快手" + i;
		}
		if (app.getPackageName(appName)) {
			//判断是否开启成功,不成功重启一次
			if (tabletOperation.openApp(appName) == false) {
				tabletOperation.killApp(appName);
				sleep(3000);
				tabletOperation.openApp(appName);
			};
		} else {
			log(appName + "应用不存在");

			break;
		}

		//开启一个线程检测弹窗
		let checkPop = threads.start(function() {
			while (true) {
				//弹窗事件
				kwaiMain.popUpEvent();
				sleep(1000);
				//滑块验证
				if (text("拖动滑块").findOne(500)) {
					kwaiMain.overSlider(_user, _pass);

				}
				sleep(1000);
			}

		});
		//快手签到
		kwaiMain.signIn();

		//快手清理缓存
		kwaiMain.cleanCache();

		//快手刷视频
		kwaiMain.run((ui.kWaiRunTimeInput.text() * 60), _user, _pass);

		//关闭快手
		tabletOperation.killApp(appName);

		//关闭检测弹窗线程
		checkPop.interrupt();
	}
}

/**
 * 保存UI配置
 */
function saveConfig() {
	let storage = storages.create('UIConfigInfo')
	let 需要备份和还原的控件id列表集合 = [
		['switchAccountBegin', 'switchAccountEnd', 'kuaiShouTime', 'weiShiTime', 'activateCode'],
		['swAccessibility', 'swFloatWindow', 'swAutoUpdate', 'swFlyModeBtn', 'swCleanApp', 'swKuaiShou', 'swWeiShi'],
	]
	需要备份和还原的控件id列表集合.map((viewIdList) => {
		let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage, ui)
		inputViewIdListRegisterListener.registerlistener()
		inputViewIdListRegisterListener.restore()
	});
}
/**
 * 初始化权限
 */
function initPermission() {
	// 无障碍权限
	auto.waitFor();
	auto.setMode("normal");
	sleep(1000);
	// 请求截图权限
	if (!requestScreenCapture()) {
		toast("过滑块需要截图权限支持");
		exit();
	};
}
