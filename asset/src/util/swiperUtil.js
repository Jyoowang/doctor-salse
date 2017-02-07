
// 所有模块都通过 define 来定义
define(function(require, exports, module) {


	// require('jquery');

	require('swipercss');

	require('swiper');

	// var options={

	// 	speed:300,	//滑动速度
	// 	autoplay:3000,		//自动切换的时间间隔（单位ms）
	// 	slidesPerView:1,	//设置slider容器能够同时显示的slides数量(carousel模式)
	// 	spaceBetween:0,  //slide间距
	// 	loop:true,	//是否循环
	// 	updateOnImagesReady:true,	//当所有的内嵌图像（img标签）加载完成后Swiper会重新初始化

	// 	isPagination:true,		//自定义,是否需要分页器容器
	// 	isButton:false,		//自定义,是否需要前进后退

	// 	bannerBox:$('header-banner')
	// }

	module.exports= {

		newSwiper:function(swiperObj,options){	//待完善（配置项）
			if(options.pagination){	//是否需要 添加分页
				swiperObj.append('<div class="swiper-pagination"></div>')
			}
			if(options.prevButton && options.nextButton){	//是否需要 添加左右切换按钮		//待完善
				swiperObj.append('<div class="swiper-button-next"></div><div class="swiper-button-prev"></div>')
			}
			var swiper = new Swiper(swiperObj, options);
		}
			
	}

});

