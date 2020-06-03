"ui";
const PJYSDK = (function () {
	function PJYSDK(app_key, app_secret) {
		http.__okhttp__.setMaxRetries(0);
		http.__okhttp__.setTimeout(10 * 1000);

		this.event = events.emitter();

		this.debug = true;
		this._lib_version = "v1.07";
		this._protocol = "https";
		this._host = "api.paojiaoyun.com";
		this._device_id = this.getDeviceID();
		this._retry_count = 9;

		this._app_key = app_key;
		this._app_secret = app_secret;

		this._card = null;
		this._username = null;
		this._password = null;
		this._token = null;

		this.is_trial = false;  // 是否是试用用户
		this.login_result = {
			"card_type": "",
			"expires": "",
			"expires_ts": 0,
			"config": "",
		};

		this._auto_heartbeat = true;  // 是否自动开启心跳任务
		this._heartbeat_gap = 60 * 1000; // 默认60秒
		this._heartbeat_task = null;
		this._heartbeat_ret = { "code": -9, "message": "还未开始验证" };

		this._prev_nonce = null;
	}
	PJYSDK.prototype.SetCard = function (card) {
		this._card = card;
	}
	PJYSDK.prototype.SetUser = function (username, password) {
		this._username = username;
		this._password = password;
	}
	PJYSDK.prototype.getDeviceID = function () {
		let id = device.serial;
		if (id == null || id == "" || id == "unknown") {
			id = device.getAndroidId();
		}
		if (id == null || id == "" || id == "unknown") {
			id = device.getIMEI();
		}
		return id;
	}
	PJYSDK.prototype.MD5 = function (str) {
		try {
			let digest = java.security.MessageDigest.getInstance("md5");
			let result = digest.digest(new java.lang.String(str).getBytes("UTF-8"));
			let buffer = new java.lang.StringBuffer();
			for (let index = 0; index < result.length; index++) {
				let b = result[index];
				let number = b & 0xff;
				let str = java.lang.Integer.toHexString(number);
				if (str.length == 1) {
					buffer.append("0");
				}
				buffer.append(str);
			}
			return buffer.toString();
		} catch (error) {
			alert(error);
			return "";
		}
	}
	PJYSDK.prototype.getTimestamp = function () {
		try {
			let res = http.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
			let data = res.body.json();
			return Math.floor(data["data"]["t"] / 1000);
		} catch (error) {
			return Math.floor(new Date().getTime() / 1000);
		}
	}
	PJYSDK.prototype.genNonce = function () {
		const ascii_str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let tmp = '';
		for (let i = 0; i < 20; i++) {
			tmp += ascii_str.charAt(Math.round(Math.random() * ascii_str.length));
		}
		return this.MD5(this.getDeviceID() + tmp);
	}
	PJYSDK.prototype.joinParams = function (params) {
		let ps = [];
		for (let k in params) {
			ps.push(k + "=" + params[k])
		}
		ps.sort()
		return ps.join("&")
	}
	PJYSDK.prototype.CheckRespSign = function (resp) {
		if (resp.code != 0 && resp.nonce === "" && resp.sign === "") {
			return resp
		}

		let ps = "";
		if (resp["result"]) {
			ps = this.joinParams(resp["result"]);
		}

		let s = resp["code"] + resp["message"] + ps + resp["nonce"] + this._app_secret;
		let sign = this.MD5(s);
		if (sign === resp["sign"]) {
			if (this._prev_nonce === null) {
				this._prev_nonce = resp["nonce"];
				return { "code": 0, "message": "OK" };
			} else {
				if (this._prev_nonce === resp["nonce"]) {
					return { "code": -98, "message": "轻点，疼~" };
				} else {
					this._prev_nonce = resp["nonce"];
					return { "code": 0, "message": "OK" };
				}
			}
		}
		return { "code": -99, "message": "轻点，疼~" };
	}
	PJYSDK.prototype.retry_fib = function (num) {
		if (num > 9) {
			return 34
		}
		let a = 0;
		let b = 1;
		for (i = 0; i < num; i++) {
			let tmp = a + b;
			a = b
			b = tmp
		}
		return a
	}
	PJYSDK.prototype._debug = function (path, params, result) {
		if (this.debug) {
			log("\n" + path, "\nparams:", params, "\nresult:", result);
		}
	}
	PJYSDK.prototype.Request = function (method, path, params) {
		// 构建公共参数
		params["app_key"] = this._app_key;

		method = method.toUpperCase();
		let url = this._protocol + "://" + this._host + path
		let max_retries = this._retry_count;
		let retries_count = 0;

		let data = { "code": -1, "message": "连接服务器失败" };
		do {
			retries_count++;
			let sec = this.retry_fib(retries_count);

			delete params["sign"]
			params["nonce"] = this.genNonce();
			params["timestamp"] = this.getTimestamp();
			let ps = this.joinParams(params);
			let s = method + this._host + path + ps + this._app_secret;
			let sign = this.MD5(s);
			params["sign"] = sign;

			let resp, body;
			try {
				if (method === "GET") {
					resp = http.get(url + "?" + ps + "&sign=" + sign);
				} else {  // POST
					resp = http.post(url, params);
				}
				body = resp.body.string();
				data = JSON.parse(body);
				this._debug(method + '-' + path + ':', params, data);

				let crs = this.CheckRespSign(data);
				if (crs.code !== 0) {
					return crs;
				} else {
					return data;
				}
			} catch (error) {
				log("[*] request error: ", error, sec + "s后重试");
				this._debug(method + '-' + path + ':', params, body)
				sleep(sec * 1000);
			}
		} while (retries_count < max_retries);

		return data;
	}
	/* 通用 */
	PJYSDK.prototype.GetHeartbeatResult = function () {
		return this._heartbeat_ret;
	}
	PJYSDK.prototype.GetTimeRemaining = function () {
		let g = this.login_result.expires_ts - this.getTimestamp();
		if (g < 0) {
			return 0;
		}
		return g;
	}
	/* 卡密相关 */
	PJYSDK.prototype.CardLogin = function () {  // 卡密登录
		if (!this._card) {
			return { "code": -4, "message": "请先设置卡密" };
		}
		if (this._token) {
			return { "code": -3, "message": "请先退出登录" };
		}
		let method = "POST";
		let path = "/v1/card/login";
		let data = { "card": this._card, "device_id": this._device_id };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this._token = ret.result.token;
			this.login_result = ret.result;
			if (this._auto_heartbeat) {
				this._startCardHeartheat();
			}
		}
		return ret;
	}
	PJYSDK.prototype.CardHeartbeat = function () {  // 卡密心跳，默认会自动调用
		if (!this._token) {
			return { "code": -2, "message": "请在卡密登录成功后调用" };
		}
		let method = "POST";
		let path = "/v1/card/heartbeat";
		let data = { "card": this._card, "token": this._token };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this.login_result.expires = ret.result.expires;
			this.login_result.expires_ts = ret.result.expires_ts;
		}
		return ret;
	}
	PJYSDK.prototype._startCardHeartheat = function () {  // 开启卡密心跳任务
		if (this._heartbeat_task) {
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		this._heartbeat_task = threads.start(function () {
			setInterval(function () { }, 10000);
		});
		this._heartbeat_ret = this.CardHeartbeat();

		this._heartbeat_task.setInterval((self) => {
			self._heartbeat_ret = self.CardHeartbeat();
			if (self._heartbeat_ret.code != 0) {
				self.event.emit("heartbeat_failed", self._heartbeat_ret);
			}
		}, this._heartbeat_gap, this);

		this._heartbeat_task.setInterval((self) => {
			if (self.GetTimeRemaining() == 0) {
				self.event.emit("heartbeat_failed", { "code": 10210, "message": "卡密已过期！" });
			}
		}, 1000, this);
	}
	PJYSDK.prototype.CardLogout = function () {  // 卡密退出登录
		this._heartbeat_ret = { "code": -9, "message": "还未开始验证" };
		if (this._heartbeat_task) { // 结束心跳任务
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		if (!this._token) {
			return { "code": 0, "message": "OK" };
		}
		let method = "POST";
		let path = "/v1/card/logout";
		let data = { "card": this._card, "token": this._token };
		let ret = this.Request(method, path, data);
		// 清理
		this._token = null;
		this.login_result = {
			"card_type": "",
			"expires": "",
			"expires_ts": 0,
			"config": "",
		};
		return ret;
	}
	PJYSDK.prototype.CardUnbindDevice = function () { // 卡密解绑设备，需开发者后台配置
		if (!this._token) {
			return { "code": -2, "message": "请在卡密登录成功后调用" };
		}
		let method = "POST";
		let path = "/v1/card/unbind_device";
		let data = { "card": this._card, "device_id": this._device_id, "token": this._token };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.SetCardUnbindPassword = function (password) { // 自定义设置解绑密码
		if (!this._token) {
			return { "code": -2, "message": "请在卡密登录成功后调用" };
		}
		let method = "POST";
		let path = "/v1/card/unbind_password";
		let data = { "card": this._card, "password": password, "token": this._token };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.CardUnbindDeviceByPassword = function (password) { // 用户通过解绑密码解绑设备
		let method = "POST";
		let path = "/v1/card/unbind_device/by_password";
		let data = { "card": this._card, "password": password };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.CardRecharge = function (card, use_card) { // 以卡充卡
		let method = "POST";
		let path = "/v1/card/recharge";
		let data = { "card": card, "use_card": use_card };
		return this.Request(method, path, data);
	}
	/* 用户相关 */
	PJYSDK.prototype.UserRegister = function (username, password, card) {  // 用户注册（通过卡密）
		let method = "POST";
		let path = "/v1/user/register";
		let data = { "username": username, "password": password, "card": card, "device_id": this._device_id };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UserLogin = function () {  // 用户账号登录
		if (!this._username || !this._password) {
			return { "code": -4, "message": "请先设置用户账号密码" };
		}
		if (this._token) {
			return { "code": -3, "message": "请先退出登录" };
		}
		let method = "POST";
		let path = "/v1/user/login";
		let data = { "username": this._username, "password": this._password, "device_id": this._device_id };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this._token = ret.result.token;
			this.login_result = ret.result;
			if (this._auto_heartbeat) {
				this._startUserHeartheat();
			}
		}
		return ret;
	}
	PJYSDK.prototype.UserHeartbeat = function () {  // 用户心跳，默认会自动开启
		if (!this._token) {
			return { "code": -2, "message": "请在用户登录成功后调用" };
		}
		let method = "POST";
		let path = "/v1/user/heartbeat";
		let data = { "username": this._username, "token": this._token };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this.login_result.expires = ret.result.expires;
			this.login_result.expires_ts = ret.result.expires_ts;
		}
		return ret;
	}
	PJYSDK.prototype._startUserHeartheat = function () {  // 开启用户心跳任务
		if (this._heartbeat_task) {
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		this._heartbeat_task = threads.start(function () {
			setInterval(function () { }, 10000);
		});
		this._heartbeat_ret = this.UserHeartbeat();

		this._heartbeat_task.setInterval((self) => {
			self._heartbeat_ret = self.UserHeartbeat();
			if (self._heartbeat_ret.code != 0) {
				self.event.emit("heartbeat_failed", self._heartbeat_ret);
			}
		}, this._heartbeat_gap, this);

		this._heartbeat_task.setInterval((self) => {
			if (self.GetTimeRemaining() == 0) {
				self.event.emit("heartbeat_failed", { "code": 10250, "message": "用户已到期！" });
			}
		}, 1000, this);
	}
	PJYSDK.prototype.UserLogout = function () {  // 用户退出登录
		this._heartbeat_ret = { "code": -9, "message": "还未开始验证" };
		if (this._heartbeat_task) { // 结束心跳任务
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		if (!this._token) {
			return { "code": 0, "message": "OK" };
		}
		let method = "POST";
		let path = "/v1/user/logout";
		let data = { "username": this._username, "token": this._token };
		let ret = this.Request(method, path, data);
		// 清理
		this._token = null;
		this.login_result = {
			"card_type": "",
			"expires": "",
			"expires_ts": 0,
			"config": "",
		};
		return ret;
	}
	PJYSDK.prototype.UserChangePassword = function (username, password, new_password) {  // 用户修改密码
		let method = "POST";
		let path = "/v1/user/password";
		let data = { "username": username, "password": password, "new_password": new_password };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UserRecharge = function (username, card) { // 用户通过卡密充值
		let method = "POST";
		let path = "/v1/user/recharge";
		let data = { "username": username, "card": card };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UserUnbindDevice = function () { // 用户解绑设备，需开发者后台配置
		if (!this._token) {
			return { "code": -2, "message": "请在用户登录成功后调用" };
		}
		let method = "POST";
		let path = "/v1/user/unbind_device";
		let data = { "username": this._username, "device_id": this._device_id, "token": this._token };
		return this.Request(method, path, data);
	}
	/* 配置相关 */
	PJYSDK.prototype.GetCardConfig = function () { // 获取卡密配置
		let method = "GET";
		let path = "/v1/card/config";
		let data = { "card": this._card };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UpdateCardConfig = function (config) { // 更新卡密配置
		let method = "POST";
		let path = "/v1/card/config";
		let data = { "card": this._card, "config": config };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.GetUserConfig = function () { // 获取用户配置
		let method = "GET";
		let path = "/v1/user/config";
		let data = { "user": this._username };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UpdateUserConfig = function (config) { // 更新用户配置
		let method = "POST";
		let path = "/v1/user/config";
		let data = { "username": this._username, "config": config };
		return this.Request(method, path, data);
	}
	/* 软件相关 */
	PJYSDK.prototype.GetSoftwareConfig = function () { // 获取软件配置
		let method = "GET";
		let path = "/v1/software/config";
		return this.Request(method, path, {});
	}
	PJYSDK.prototype.GetSoftwareNotice = function () { // 获取软件通知
		let method = "GET";
		let path = "/v1/software/notice";
		return this.Request(method, path, {});
	}
	PJYSDK.prototype.GetSoftwareLatestVersion = function (current_ver) { // 获取软件最新版本
		let method = "GET";
		let path = "/v1/software/latest_ver";
		let data = { "version": current_ver };
		return this.Request(method, path, data);
	}
	/* 试用功能 */
	PJYSDK.prototype.TrialLogin = function () {  // 试用登录
		let method = "POST";
		let path = "/v1/trial/login";
		let data = { "device_id": this._device_id };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this.is_trial = true;
			this.login_result = ret.result;
			if (this._auto_heartbeat) {
				this._startTrialHeartheat();
			}
		}
		return ret;
	}
	PJYSDK.prototype.TrialHeartbeat = function () {  // 试用心跳，默认会自动调用
		let method = "POST";
		let path = "/v1/trial/heartbeat";
		let data = { "device_id": this._device_id };
		let ret = this.Request(method, path, data);
		if (ret.code == 0) {
			this.login_result.expires = ret.result.expires;
			this.login_result.expires_ts = ret.result.expires_ts;
		}
		return ret;
	}
	PJYSDK.prototype._startTrialHeartheat = function () {  // 开启试用心跳任务
		if (this._heartbeat_task) {
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		this._heartbeat_task = threads.start(function () {
			setInterval(function () { }, 10000);
		});
		this._heartbeat_ret = this.TrialHeartbeat();

		this._heartbeat_task.setInterval((self) => {
			self._heartbeat_ret = self.CardHeartbeat();
			if (self._heartbeat_ret.code != 0) {
				self.event.emit("heartbeat_failed", self._heartbeat_ret);
			}
		}, this._heartbeat_gap, this);

		this._heartbeat_task.setInterval((self) => {
			if (self.GetTimeRemaining() == 0) {
				self.event.emit("heartbeat_failed", { "code": 10407, "message": "试用已到期！" });
			}
		}, 1000, this);
	}
	PJYSDK.prototype.TrialLogout = function () {  // 试用退出登录，没有http请求，只是清理本地记录
		this.is_trial = false;
		this._heartbeat_ret = { "code": -9, "message": "还未开始验证" };
		if (this._heartbeat_task) { // 结束心跳任务
			this._heartbeat_task.interrupt();
			this._heartbeat_task = null;
		}
		// 清理
		this._token = null;
		this.login_result = {
			"card_type": "",
			"expires": "",
			"expires_ts": 0,
			"config": "",
		};
		return { "code": 0, "message": "OK" };;
	}
	/* 高级功能 */
	PJYSDK.prototype.GetRemoteVar = function (key) { // 获取远程变量
		let method = "GET";
		let path = "/v1/af/remote_var";
		let data = { "key": key };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.GetRemoteData = function (key) { // 获取远程数据
		let method = "GET";
		let path = "/v1/af/remote_data";
		let data = { "key": key };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.CreateRemoteData = function (key, value) { // 创建远程数据
		let method = "POST";
		let path = "/v1/af/remote_data";
		let data = { "action": "create", "key": key, "value": value };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.UpdateRemoteData = function (key, value) { // 修改远程数据
		let method = "POST";
		let path = "/v1/af/remote_data";
		let data = { "action": "update", "key": key, "value": value };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.DeleteRemoteData = function (key, value) { // 删除远程数据
		let method = "POST";
		let path = "/v1/af/remote_data";
		let data = { "action": "delete", "key": key };
		return this.Request(method, path, data);
	}
	PJYSDK.prototype.CallRemoteFunc = function (func_name, params) { // 执行远程函数
		let method = "POST";
		let path = "/v1/af/call_remote_func";
		let ps = JSON.stringify(params);
		let data = { "func_name": func_name, "params": ps };
		let ret = this.Request(method, path, data);
		if (ret.code == 0 && ret.result.return) {
			ret.result = JSON.parse(ret.result.return);
		}
		return ret;
	}
	return PJYSDK;
})();
/* 将PJYSDK.js文件中的代码复制粘贴到上面 */
// 本程序未加密，如果你尝试反编译学习，非常欢迎。但是你要是拿去倒卖，你全家死光光。

const _user = "yzl178me";
const _pass = "Yangzelin995;";
var Apparr = ["Auto.js Pro", "合集"];	//不被清理的应用数组,通用
var menu_color = "#000000";
var tabletOperation = require("./Libary/平板操作/tabletOperation.js");

// 泡椒云网络验证
var pjysdk = new PJYSDK("br9kmn4o6it9d0r0g7tg", "jR912CAWmLvcK4g9P18FgIr2XBSpYcKa");
// 监听心跳失败事件
pjysdk.event.on("heartbeat_failed", function (hret) {
	toast(hret.message);  // 失败提示信息
	exit();  // 退出脚本
})


//ui
// var accessibility;	//无障碍
var flightMode;		//飞行模式
var cleanApp;		//清理App
var switchAccountBegin;	//换号开始
var switchAccountEnd;	//换号结束


let ViewIdListRegisterListener = require("./Libary/utils/saveUIConfig.js");
ui.layoutFile("./main.xml");
// 初始化UI;
initUI();

//保存配置
var mainThread = threads.currentThread();
mainThread.setTimeout(function () {
	saveConfig();
}, 500);

//检查App是否安装
mainThread.setTimeout(function () {
	//勾选快手选项时,检查应用是否安装
	let downloadThread = threads.start(function () {
		let kuaiShouUrl = "https://j13.baidupan.com/060313bb/2020/06/03/1a22c52d7a102abfcb82318b981d5042.apk?st=Lsg_T-QxNQbgXr-pVIauwA&e=1591163454&b=VOMLtAijVrUC3lSJUecEnlKGXegHhgOaB7MBhQKNAy8GNQp6BW4_c&fi=24050349&pid=36-148-104-209&up=1."
		switchEvent(ui.swKuaiShou, kuaiShouUrl, "com.kuaishou.nebula");
		let weiShiUrl = "https://a13.baidupan.com/060313bb/2020/06/03/c8e3666cc297f43ea462e5a0aeea9569.apk?st=Y64f_qFgqn9ISL5gr834Dw&e=1591163108&b=UuUPsVX7BOlYqlWFAnwPagMmDTo_c&fi=24050370&pid=36-148-104-209&up=1.";
		switchEvent(ui.swWeiShi, weiShiUrl, "com.tencent.weishi");
	});
}, 500);

//UI事件
uiEvent();

// 初始化权限;
initPermissionThread = threads.start(function () {
	initPermission();
});

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
	switchAccountBegin = ui.switchAccountBegin.text();
	switchAccountEnd = ui.switchAccountEnd.text();
	while (true) {
		//快手极速版
		if (ui.swKuaiShou.isChecked()) {
			kuaishou();
		}
		//抖音短视频
		if (ui.swWeiShi.isChecked()) {
			weiShi();
		}
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
	var kwaiMain = require("./快手刷视频/kuaishou.js"); //导入快手js文件
	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = switchAccountBegin; i <= switchAccountEnd; i++) {

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
		kwaiMain.run((ui.kuaiShouTime.text() * 60), _user, _pass);

		//关闭快手
		tabletOperation.killApp(appName);
		//关闭检测弹窗线程
		checkPop.interrupt();
	}
}

function weiShi() {
	var weiShi = require("./微视/weiShi.js"); //导入快手js文件
	let appName;	//应用名
	// switchAccountBegin 换号区间 开始
	// switchAccountEnd 换号区间 结束
	for (var i = switchAccountBegin; i <= switchAccountEnd; i++) {

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

		//微视刷视频
		weiShi.run((ui.weiShiTime.text() * 60));

		//关闭微视
		tabletOperation.killApp(appName);
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
	log(111);
	if (res.statusCode != 200) {
		toastLog("请求失败");
		return false;
	}
	log(222);
	files.writeBytes(filePath, res.body.bytes());
	toast("下载成功");
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
 * 保存UI配置
 */
function saveConfig() {
	// 初始化数据
	let initStorage = storages.create("InitConfig")
	let storage = storages.create('UIConfigInfo')
	let 需要备份和还原的控件id列表集合 = [
		['switchAccountBegin', 'switchAccountEnd', 'kuaiShouTime', 'weiShiTime', 'activateCode'],
		['swAccessibility', 'swFloatWindow', 'swAutoUpdate', 'swFlyModeBtn', 'swCleanApp', 'swKuaiShou', 'swWeiShi'],
	]
	需要备份和还原的控件id列表集合.map((viewIdList) => {
		let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage, ui);
		// 恢复配置的条件是已经初始化过了
		if (initStorage.get("inited") != null) {
			inputViewIdListRegisterListener.registerlistener()
			inputViewIdListRegisterListener.restore()
		}
	});
	// 如果未初始化
	if (initStorage.get("inited") == null) {
		// 设置初始为True
		initStorage.put("inited", true);
	}
}

function uiEvent() {
	// 点击开始后要做的事
	ui.runAllBtn.on("click", () => {
		log("runAllBtn");
		pjysdk.SetCard(ui.activateCode.text());
		threads.start(function () {
			let login_ret = pjysdk.CardLogin();
			if (login_ret.code == 0) {
				// 登录成功，后面写你的业务代码
				toast("脚本即将启动");
				main();
			} else {
				// 登录失败提示
				toast(login_ret.message);
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
	// 当用户回到本界面时，resume事件会被触发
	ui.emitter.on("resume", function () {
		// 此时根据无障碍服务的开启情况，同步开关的状态
		ui.swAccessibility.checked = auto.service != null;
	});

	//退出脚本
	ui.exitBtn.on("click", () => {
		toast("欢迎再次使用");
		pjysdk.CardLogout();
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
