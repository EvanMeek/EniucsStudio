"ui";

const _user = "yzl178me";
const _pass = "Yangzelin995;";
var menu_color = "#000000";
var tabletOperation = require("./Libary/平板操作/tabletOperation.js");

let ViewIdListRegisterListener = require("./Libary/utils/saveUIConfig.js");
ui.layoutFile("./main.xml");
// 初始化UI;
initUI();
// 初始化权限;
initPermissionThread = threads.start(function(){
    initPermission();
});
// 杀死初始化权限线程
initPermissionThread.interrupt();

// 点击开始后要做的事
ui.runAllBtn.on("click", () => {
	log("runAllBtn");
	threads.start(function () {
		main();
	});
});

saveConfig();

/**
 * 主函数
 */
function main() {
    if(ui.swBtn.isChecked()){
    	tabletOperation.openApp("快手极速版");
    	kwai();
    }
    if(ui.swBtn2.isChecked()){
	    // douyin();
    }
}
/**
 * 初始化UI
 */
function initUI() {
	ui.viewpager.setTitles(["首页", "功能管理", "功能参数"]);
	ui.tabs.setupWithViewPager(ui.viewpager);
	activity.setSupportActionBar(ui.toolbar);
	ui.toolbar.setupWithDrawer(ui.drawer);
	ui.emitter.on("create_options_menu", (menu) => {
		menu.add("日志");
		menu.add("关于");
	});
	ui.emitter.on("options_item_selected", (e, item) => {
		switch (item.getTitle()) {
			case "日志":
				app.startActivity("console");
				break;
		}
	});
	// 设置左滑菜单栏的数据源
	ui.menu.setDataSource([
		{
			text: "One",
			icon: "@drawable/ic_android_black_48dp",
		},
		{
			text: "Two",
			icon: "@drawable/ic_settings_black_48dp",
		},
		{
			text: "Three",
			icon: "@drawable/ic_favorite_black_48dp",
		},
		{
			text: "Exit",
			icon: "@drawable/ic_exit_to_app_black_48dp",
		},
	]);

	ui.swBtn.on("click", () => {
		if (!ui.swBtn.isChecked())
			ui.vw.attr("bg", "#f44336");
		else
			ui.vw.attr("bg", "#4caf50");

	});
	ui.swBtn2.on("click", () => {
		if (!ui.swBtn2.isChecked())
			ui.vw2.attr("bg", "#f44336");
		else
			ui.vw2.attr("bg", "#4caf50");
	});
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
	//获取UI信息
	var flyModeStat = ui.kWaiFlyModeBtn.isChecked();
	var signInStat = ui.kWaiSignInBtn.isChecked();
	var cleanCacheStat = ui.kWaiCleanCacheBtn.isChecked();

	let appName;	//应用名

	let Apparr = ["Auto.js Pro"];	//不被清理的应用数组
	for (var i = 0; i < 3; i++) {

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
			tabletOperation.openApp(appName);
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
				//滑块验证
				if (text("拖动滑块").findOne(500)) {
					kwaiMain.overSlider(_user, _pass);
				}
				sleep(1000);
			}
		});
		//快手签到
		if (signInStat) {
			kwaiMain.signIn();
		}

		//快手清理缓存
		if (cleanCacheStat) {
			kwaiMain.cleanCache();
		}

		//关闭检测弹窗线程
		checkPop.interrupt();

		//快手刷视频
		kwaiMain.run((ui.kWaiRunTimeInput.text() * 60), _user, _pass);

		//关闭快手
		tabletOperation.killApp(appName);
	}
}
/**
 * 保存UI配置
 */
function saveConfig(){
    let storage = storages.create('UIConfigInfo')
    let 需要备份和还原的控件id列表集合 = [
	['kWaiRunTimeInput'],
	['kWaiFlyModeBtn','kWaiSignInBtn','kWaiCleanCacheBtn'],
	['swBtn', 'swBtn2']
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
function initPermission(){
    // 无障碍权限
    auto();
    requestScreenCapture();
}
