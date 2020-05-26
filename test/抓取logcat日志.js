var log_text =  new Shell().exec("logcat -f /sdcard/脚本/log.txt");
ui.layoutFile("catchLogCat.xml");
ui.log_text.attr("text", log_text);
