"ui";

main();
var menu_color = "#000000";
/**
 * 主函数
 */
function main(){
    initUI();
}
/**
 * 初始化UI
 */
function initUI() {

    ui.layoutFile("./main.xml");
    ui.viewpager.setTitles(["功能管理", "功能参数"]);
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
	log("被点击");
	if (!ui.swBtn.isChecked()) ui.vw.attr("bg", "#f44336");
	else ui.vw.attr("bg", "#4caf50");
    });
    ui.swBtn2.on("click", () => {
	log("被点击");
	if (!ui.swBtn2.isChecked()) ui.vw2.attr("bg", "#f44336");
	else ui.vw2.attr("bg", "#4caf50");
    });
}
