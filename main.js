"ui";

// 本程序未加密，如果你尝试反编译学习，非常欢迎。但是你要是拿去倒卖，你全家死光光。
let pjyModule = require("./Libary/utils/pjy.js");
let tabletOperation = require("./Libary/平板操作/tabletOperation.js");
let ViewIdListRegisterListener = require("./Libary/utils/saveUIConfig.js");
let dataUtils = require("./Libary/utils/dataUtils.js");
let checkUpdate = require("./Libary/utils/checkUpdate.js");
const _user = "yzl178me";
const _pass = "Yangzelin995;";
var Apparr = ["Auto.js Pro", "掘金时代"];	//不被清理的应用数组,通用
var menu_color = "#000000";

// 泡椒云网络验证
var pjy = new pjyModule("br9kmn4o6it9d0r0g7tg", "jR912CAWmLvcK4g9P18FgIr2XBSpYcKa");
var loginStat;
pjy.debug = false;
// 监听心跳失败事件
pjy.event.on("heartbeat_failed", function (hret) {
	toast(hret.message);  // 失败提示信息
	exit();  // 退出脚本
})


//ui
// var accessibility;	//无障碍
var flightMode;		//飞行模式
var cleanApp;		//清理App
var kuaiShouswitchAccountBegin;	//快手换号开始
var kuaiShouSwitchAccountEnd;	//快手换号结束
var weiShiSwitchAccountBegin;
var weiShiSwitchAccountEnd;
var shuaBaoSwitchAccountBegin;
var shuaBaoSwitchAccountEnd;

// 初始化权限;
initPermissionThread = threads.start(function () {
	initPermission();
});

var initFloatWindowThread = threads.start(function(){
	var initFloatWindow = floaty.rawWindow(
		<vertical w="*" h="*" bg="#ffffff">
			<img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"/>
			<text>掘金时代推广版</text>
		</vertical>
	);
	initFloatWindow.setSize(-1,-1);
	setTimeout(()=>{
		initFloatWindow.close();
	},5000)
});

ui.layoutFile("./main.xml");
// 初始化UI;
initUI();

//保存配置
var mainThread = threads.currentThread();
mainThread.setTimeout(function () {
	saveConfig();
	//解决第一次读取ui配置为空的bug
	let uiSwitchAccountData =
		[
			ui.kuaishouSwitchAccountBegin, ui.kuaishouswitchAccountEnd, ui.weiShiSwitchAccountBegin, ui.weiShiSwitchAccountEnd,
			ui.shuaBaoSwitchAccountBegin, ui.shuaBaoSwitchAccountEnd,
		];
	let uiTime =
		[
			ui.kuaiShouTime, ui.weiShiTime, ui.shuaBaoTime
		]
	checkIniData(uiSwitchAccountData, uiTime);

}, 500);

//检查App是否安装
mainThread.setTimeout(function () {
	//自动验证
	pjy.SetCard(ui.activateCode.text());
	loginStat = pjy.CardLogin();
	if (loginStat.code != 0) {
		toast(loginStat.message);
	} else if (loginStat.code == 0) {
		toastLog("验证成功，欢迎使用!");
		ui.remainDayText.setText(dataUtils.secondsFormat(pjy.GetTimeRemaining()));
	}

	let downloadThread = threads.start(function () {
		let kuaiShouUrl = "https://178me.lanzous.com/i3i0edagc8j"
		//勾选快手选项时,检查应用是否安装
		switchEvent(ui.swKuaiShou, kuaiShouUrl, "com.kuaishou.nebula");
		let weiShiUrl = "https://178me.lanzous.com/iRyTddagcta";
		switchEvent(ui.swWeiShi, weiShiUrl, "com.tencent.weishi");
		let shuaBaoUrl = "https://178me.lanzous.com/iaxHRdlcs9i";
		switchEvent(ui.swShuaBao, shuaBaoUrl, "com.jm.video");
	});
}, 500);

//UI事件
uiEvent();



/**
 * App开关事件
 * @param {开关控件的对象} uiobj 例如:ui.swKuaiShou
 * @param {下载地址} url 
 * @param {应用包名} appPackages 
 */
function switchEvent(uiobj, url, appPackages) {
	let is;
	uiobj.on("check", function (checked) {
		if (checked) {
			let filePath = files.getSdcardPath() + "/test.apk";
			is = appIsInstalled(appPackages);
			if (!is) {
				confirm("检查到该应用未安装,是否安装?").then(value => {
					//当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
					log("is:" + value);
					if (value) {
						// downloadApp(filePath, url);
						app.openUrl(url);
						uiobj.checked = true;
					} else {
						uiobj.checked = false;
					}
				});
			}
		}
	})
}

/**
 * 主函数
 */
function main() {
	// 等待线程完成之后杀死初始化权限线程
	initPermissionThread.join(60000);
	initPermissionThread.interrupt();

	//初始化信息
	accessibility = ui.swAccessibility.isChecked();
	flightMode = ui.swFlyModeBtn.isChecked();
	cleanApp = ui.swCleanApp.isChecked();
	kuaiShouswitchAccountBegin = ui.kuaishouSwitchAccountBegin.text();
	kuaiShouSwitchAccountEnd = ui.kuaishouswitchAccountEnd.text();
	weiShiSwitchAccountBegin = ui.weiShiSwitchAccountBegin.text();
	weiShiSwitchAccountEnd = ui.weiShiSwitchAccountEnd.text();
	shuaBaoSwitchAccountBegin = ui.shuaBaoSwitchAccountBegin.text();
	shuaBaoSwitchAccountEnd = ui.shuaBaoSwitchAccountEnd.text();
	while (true) {
		//快手极速版
		if (ui.swKuaiShou.isChecked()) {
			log("快手极速版");
			kuaishou();
		}
		//抖音短视频
		if (ui.swWeiShi.isChecked()) {
			log("微视");
			weiShi();
		}
		//刷宝短视频
		if (ui.swShuaBao.isChecked()) {
			log("刷宝");
			shuaBao();
		}

		//是否开启循环
		if (!ui.swTaskCycle.isChecked()) {
			break;
		}
	}
	if (ui.swPowerOff.isChecked()) {
		tabletOperation.powerOff();
	}
}

/**
 * 快手
 * @UI ID如下:
 * 首页按钮: runAllBtn
 * 功能管理: 快手刷视频-swBtn 抖音刷视频-swBtn2
 * 功能参数: 刷视频时间-kwaiRunTimeInput 飞行模式-kWaiFlyModeBtn 签到-kWaiSignInBtn 清理缓存-kWaiCleanCacheBtn
 */
function kuaishou() {
	var kwaiMain = require("./快手/kuaiShou.js"); //导入快手js文件
	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = kuaiShouswitchAccountBegin; i <= kuaiShouSwitchAccountEnd; i++) {

		//清理后台App(平台专属)
		if (cleanApp) {
			tabletOperation.clearApp(Apparr);
			sleep(1000);
		}

		//飞行模式
		if (flightMode) {
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
		let checkPop = threads.start(function () {
			while (true) {
				//弹窗事件
				kwaiMain.popUpEvent();
				sleep(1000);
				// //滑块验证
				// if (text("拖动滑块").findOne(500)) {
				// 	sleep(1500);
				// 	kwaiMain.overSlider(_user, _pass);
				// }
				// sleep(1000);
			}

		});
		//快手签到
		kwaiMain.signIn();

		//快手清理缓存
		kwaiMain.cleanCache();

		//快手刷视频
		kwaiMain.run((ui.kuaiShouTime.text() * 60), _user, _pass);

		//关闭快手
		tabletOperation.killApp(appName);
		//关闭检测弹窗线程
		checkPop.interrupt();
	}
}

function weiShi() {
	var weiShi = require("./微视/weiShi.js"); //导入快手js文件
	var kwaiMain = require("./快手/kuaiShou.js"); //导入快手js文件
	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = weiShiSwitchAccountBegin; i <= weiShiSwitchAccountEnd; i++) {
		//清理后台App(平台专属)
		if (cleanApp) {
			tabletOperation.clearApp(Apparr);
			sleep(1000);
		}

		//飞行模式
		if (flightMode) {
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
			appName = "微视";
		} else {
			appName = "微视" + i;
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
		let checkPop = threads.start(function () {
			while (true) {
				//弹窗事件
				kwaiMain.popUpEvent();
				sleep(1000);
			}
		});

		//微视刷视频
		weiShi.run((ui.weiShiTime.text() * 60));

		//关闭微视
		tabletOperation.killApp(appName);

		//关闭检测弹窗线程
		checkPop.interrupt();
	}
}

function shuaBao() {
	var shuaBao = require("./刷宝/shuaBao.js"); //导入快手js文件
	var kwaiMain = require("./快手/kuaiShou.js"); //导入快手js文件
	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = shuaBaoSwitchAccountBegin; i <= shuaBaoSwitchAccountEnd; i++) {
		// log(1);
		//清理后台App(平台专属)
		if (cleanApp) {
			tabletOperation.clearApp(Apparr);
			sleep(1000);
		}

		//飞行模式
		if (flightMode) {
			tabletOperation.openFlightMode();
			log("开启飞行模式");
			sleep(3000);
			tabletOperation.closeFlightMode();
			log("关闭飞行模式");
			//检查网络
			tabletOperation.isNetwork();
		}
		// log(2);
		//第0个默认为原版快手,其他的按这个顺序来
		if (i == 0) {
			appName = "刷宝短视频";
		} else {
			appName = "刷宝短视频" + i;
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
		let checkPop = threads.start(function () {
			while (true) {
				//弹窗事件
				kwaiMain.popUpEvent();
				sleep(1000);
			}
		});

		//刷视频
		shuaBao.run((ui.shuaBaoTime.text() * 60));

		//关闭微视
		tabletOperation.killApp(appName);

		//关闭检测弹窗线程
		checkPop.interrupt();
	}
}

/**
 * 解决保存配置的第一次读取为空的bug
 * @param {帐号区间数组} uiSwitchAccountData 
 * @param {视频时间} uiTime 
 */
function checkIniData(uiSwitchAccountData, uiTime) {
	for (let i = 0; i < uiSwitchAccountData.length; i++) {
		if (uiSwitchAccountData[i].text() == "") {
			uiSwitchAccountData[i].setText("0");
		}
	}
	for (let i = 0; i < uiTime.length; i++) {
		if (uiTime[i].text() == "") {
			uiTime[i].setText("60");
		}
	}
}


/**
 * 快速判断应用是否安装
 * @param {包名} appPackages 
 */
function appIsInstalled(appPackages) {
	let is = shell("pm list packages " + appPackages);
	is = parseInt(is.toString().indexOf(appPackages));
	let returnValue = false;
	if (is != -1) {
		returnValue = true;
	}
	return returnValue;
}

/**
 * 下载App文件
 * @param {文件路径} filePath 
 * @param {下载链接} url 
 */
function downloadApp(filePath, url) {
	let res = http.get(url);
	if (res.statusCode != 200) {
		toastLog("请求失败");
		return false;
	}
	files.writeBytes(filePath, res.body.bytes());
	toastLog("下载成功");
	app.viewFile(filePath);
	return true;
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
	/*
	================================================视频播放类-BEGIN================================================
	 */
	// ui.viewpager.setTitles(["基础设置", "功能管理", "参数设置"]);
	// ui.appTypeViewPager.setTitles(["视频播放类", "新闻阅读类"]);
	// var videoItems = [
	// 	{ appName: "快手视频", appNameColor: "#000000", appSwitchBtn: "swKuaiShou", appRunTimeInput: "kuaiShouTime" },
	// 	{ appName: "微视视频", appNameColor: "#000000", appSwitchBtn: "swWeiShi", appRunTimeInput: "weiShiTime" },
	// 	{ appName: "抖呱呱", appNameColor: "#CDC5BF", appSwitchBtn: "swDouGuaGua", appRunTimeInput: "douGuaGuaTime" },
	// 	{ appName: "鲤刷刷", appNameColor: "#CDC5BF", appSwitchBtn: "swLiShuaShua", appRunTimeInput: "liShuaShuaTime" },
	// 	{ appName: "趣铃声", appNameColor: "#CDC5BF", appSwitchBtn: "swQuLingSheng", appRunTimeInput: "quLingShengTime" },
	// 	{ appName: "酷铃声", appNameColor: "#CDC5BF", appSwitchBtn: "swKuLingSheng", appRunTimeInput: "kuLingShengTime" },
	// 	{ appName: "小糖糕", appNameColor: "#CDC5BF", appSwitchBtn: "swXiaoTangGao", appRunTimeInput: "xiaoTangGaoTime" },
	// 	{ appName: "刷宝视频", appNameColor: "#CDC5BF", appSwitchBtn: "shuaBao", appRunTimeInput: "shuaBaoTime" },
	// 	{ appName: "快逗视频", appNameColor: "#CDC5BF", appSwitchBtn: "kuaiDou", appRunTimeInput: "kuaiDouTime" },
	// 	{ appName: "花生视频", appNameColor: "#CDC5BF", appSwitchBtn: "huaSheng", appRunTimeInput: "huaShengTime" },
	// 	{ appName: "抖音视频", appNameColor: "#CDC5BF", appSwitchBtn: "douYin", appRunTimeInput: "douYinTime" },
	// 	{ appName: "火山视频", appNameColor: "#CDC5BF", appSwitchBtn: "huoShan", appRunTimeInput: "huoShanTime" },
	// 	{ appName: "闪电视频", appNameColor: "#CDC5BF", appSwitchBtn: "shanDian", appRunTimeInput: "shanDianTime" },
	// 	{ appName: "闪鸭视频", appNameColor: "#CDC5BF", appSwitchBtn: "shanYa", appRunTimeInput: "shanYaTime" },
	// 	{ appName: "彩蛋视频", appNameColor: "#CDC5BF", appSwitchBtn: "caiDan", appRunTimeInput: "caiDanTime" },
	// 	{ appName: "天天清理", appNameColor: "#CDC5BF", appSwitchBtn: "tianTian", appRunTimeInput: "tianTianTime" },
	// 	{ appName: "网赚红包", appNameColor: "#CDC5BF", appSwitchBtn: "wangZhuan", appRunTimeInput: "wangZhuanTime" },
	// ];
	// ui.videoList.setDataSource(videoItems);
	/*
	================================================视频播放类-END================================================
	 */
	let announcement = pjy.GetSoftwareNotice();
	if (announcement.result.notice != null || announcement.result.notice != "") {
		ui.announcementText.setText(announcement.result.notice);
	} else {
		ui.announcementText.setText("暂无公告");
	}

	ui.precautions.setText(
		"\n1. 请确保已授权无障碍服务\n\n2. 请确保设备系统 >= Android 7.0\n\n3. 请确保已授权悬浮窗权限（第一次使用需先关后开）\n\n4. 请确保已授权截图权限（每次都会询问，可以选择不再询问）\n\n5. 请确保已授权Root权限（第一次使用需先关后开）");
}

/**
 * 保存UI配置
 */
function saveConfig() {
	// 初始化数据
	// let initStorage = storages.create("InitConfig")
	let storage = storages.create('UIConfigInfo')
	let 需要备份和还原的控件id列表集合 = [
		['kuaishouSwitchAccountBegin', 'kuaishouswitchAccountEnd', 'weiShiSwitchAccountBegin', 'weiShiSwitchAccountEnd'
			, 'shuaBaoSwitchAccountBegin', 'shuaBaoSwitchAccountEnd'
			, 'kuaiShouTime', 'weiShiTime', 'shuaBaoTime'
			, 'activateCode'],
		['swFloatWindow', 'swFloatWindow', 'swFlyModeBtn', 'swCleanApp', 'swSignIn', 'swTaskCycle'
			, 'swKuaiShou', 'swWeiShi', 'swShuaBao'],
	]
	需要备份和还原的控件id列表集合.map((viewIdList) => {
		let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage, ui);
		// 恢复配置的条件是已经初始化过了
		// if (initStorage.get("inited") != null) {
		inputViewIdListRegisterListener.registerlistener()
		inputViewIdListRegisterListener.restore()
		// }
	});
	// 如果未初始化
	// if (initStorage.get("inited") == null) {
	// 	// 设置初始为True
	// 	initStorage.put("inited", true);
	// }
}

function uiEvent() {
	ui.checkUpdateBtn.on("click", () => {
		checkUpdate.checkUpdate();
	});
	// ui.unBindBtn.on("click", () => {
	// 	toast(pjy.CardUnbindDevice().message);
	// });
	ui.activateBtn.on("click", () => {
		pjy.SetCard(ui.activateCode.text().trim());
		loginStat = pjy.CardLogin();
		if (loginStat.code != 0) {
			toast(loginStat.message);
		} else if (loginStat.code == 0) {
			toast("验证成功，欢迎使用!");
			ui.remainDayText.setText(dataUtils.secondsFormat(pjy.GetTimeRemaining()));
		}
	});
	// 点击开始后要做的事
	ui.runAllBtn.on("click", () => {
		log("runAllBtn");
		threads.start(function () {
			// let login_ret = pjy.CardLogin();
			if (loginStat.code == 0) {
				// 登录成功，后面写你的业务代码
				toast("脚本即将启动");
				main();
			} else {
				// 登录失败提示
				toast(loginStat.message);
			}
		});
	});

	//查看日志
	ui.logBtn.on("click", () => {
		app.startActivity("console");
	});

	//无障碍服务
	ui.swAccessibility.on("check", function (checked) {
		// 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
		if (checked && auto.service == null) {
			app.startActivity({
				action: "android.settings.ACCESSIBILITY_SETTINGS"
			});
		}
		if (!checked && auto.service != null) {
			auto.service.disableSelf();
		}
	});
	//悬浮窗服务
	ui.swFloatWindow.on("check", function (checked) {
		// 用户勾选悬浮窗服务的选项时，跳转到页面让用户去开启
		if (checked) {
			app.startActivity({
				action: "android.settings.action.MANAGE_OVERLAY_PERMISSION"
			});
		}
	});

	//Root
	ui.swRoot.on("check", function (checked) {
		// 用户勾选Root的选项时，
		if (checked) {
			shell("ls", true);
		}
	});

	// 当用户回到本界面时，resume事件会被触发
	ui.emitter.on("resume", function () {
		// 此时根据无障碍服务的开启情况，同步开关的状态
		ui.swAccessibility.checked = auto.service != null;
	});

	//退出脚本
	ui.exitBtn.on("click", () => {
		toast("欢迎再次使用");
		pjy.CardLogout();
		exit();
	});

}

/**
 * 初始化权限
 */
function initPermission() {
	// 请求截图权限
	if (!requestScreenCapture()) {
		toast("过滑块需要截图权限支持");
		exit();
	};
}
