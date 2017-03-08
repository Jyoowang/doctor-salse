
seajs.config({

	// Sea.js 的基础路径
	base: "../asset/libs/",

	// 别名配置
	alias: {
		"jquery": "jquery/jquery/2.2.3/jquery.min.js",
		"jweixin": "wx/jweixin-1.0.0.js",
		"iscrollProbe": "iscroll/5.2.0/iscroll-probe.js",
		"swiper": "swiper/js/swiper.min.js",
		"swipercss": "swiper/css/swiper.min.css",
		"signalrhubs": "jquery/signalR/signalr.hubs.js",
		"signalr": "jquery/signalR/jquery.signalR-2.2.0.js",
		"lrz": "jquery/lrz/lrz.mobile.min.js",

	},

	// 路径配置
	paths: {
    	// 'libs': '../../../asset/lib/',
    	// 'modules': '../dist/js/',
    	// 'css': '../../../asset/css/',
    	// 'base': '../../base/util/'
  	},
	// 变量配置
	vars: {
		// 'version': 'v20160504'
	},

	// 映射配置
	map: [[/^(.*\.(?:css|js))(.*)$/i, '$1?v201703081024']],

	// 预加载项
	preload: [
		window.$ || window.jQuery ? '' :'jquery'
	],

	// 调试模式
	debug: false, 	//debug 有3个值可选，0|1|2

	// 文件编码
	charset: 'utf-8'

})

seajs.ISDEV=true;
