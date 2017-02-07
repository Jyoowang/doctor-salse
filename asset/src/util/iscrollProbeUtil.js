
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

	require('iscrollProbe');



	function NewIscroll(value){

		this.isBottom=false;
		this.isTop=false;
		this.isTop1=false;
		this.Wrapper=document.querySelector(value.wrapper)
		this.myScroll=new IScroll(value.wrapper,value.options);

		if(value.isLoading){
			var oDiv=document.createElement("div");
	        oDiv.className='scroller-pullUp';
	        oDiv.innerHTML='<img src="../../asset/images/public/loading.gif" /><span>加载更多...</span>';
	        this.Wrapper.children[0].appendChild(oDiv);
		}

		if(value.isTopLoading){
			var oDiv=document.createElement("div");
	        oDiv.className='scroller-pullDown';
	        oDiv.innerHTML='<img src="../../asset/images/public/loading.gif" /><span>下拉加载更多...</span>';
	        this.Wrapper.children[0].insertBefore(oDiv,this.Wrapper.children[0].childNodes[0]);
		} 

		var _this=this;
		//开始滚动
		this.myScroll.on('scrollStart', function(){
			if(value.onScrollStart && typeof value.onScrollStart =='function')
				value.onScrollStart();
		});

		//内容滚动时触发
		this.myScroll.on('scroll', function(){
			//上拉
			if(this.y>>0 < this.maxScrollY){
				if(Math.abs(this.y>>0) - Math.abs(this.maxScrollY)>50){
					if(value.isLoading){
						var pullUp=_this.Wrapper.children[0].getElementsByClassName('scroller-pullUp')[0];
						// console.log(pullUp);
						pullUp.style.display="block";
					}

					if(!_this.isBottom){
						_this.myScroll.maxScrollY-=30
						_this.myScroll.y-=30
						_this.myScroll.scrollerHeight+=30
						// console.log(myScroll)
					}

					_this.isBottom=true
					if(value.onScroll && typeof value.onScroll =='function')
						value.onScroll();

				}
			}
			//下拉
			if(this.y>>0 > 10){
				// console.log(this.y>>0);
				if(value.isTopLoading){
					var pullDown=_this.Wrapper.children[0].getElementsByClassName('scroller-pullDown')[0];
					// console.log(pullUp);
					pullDown.style.display="block";
					_this.isTop1=true;
					if(this.y>>0 > 50){
						pullDown.getElementsByTagName('span')[0].innerHTML='放开加载更多...'
						_this.isTop=true
					}
				}
			}



		});


		//停止滚动时触发
		
		this.myScroll.on('scrollEnd', function(){
			if(_this.isBottom){
				_this.isBottom = false;
				if(value.onScrollEnd && typeof value.onScrollEnd =='function'){
					value.onScrollEnd();
				}
			}

			if(_this.isTop){
				_this.isTop = false;
				if(value.onScrollTopEnd && typeof value.onScrollTopEnd =='function'){
					value.onScrollTopEnd();
				}
			}

			if(_this.isTop1){
				var pullDown=_this.Wrapper.children[0].getElementsByClassName('scroller-pullDown')[0]
				pullDown.getElementsByTagName('span')[0].innerHTML='下拉加载更多...'
				pullDown.style.display="none";
			}

			//结束时执行
			if(value.onScrollEndSpare){
				value.onScrollEndSpare()
			}

		});

	}


	NewIscroll.prototype.hideLoading = function(){
		var pullUp=this.Wrapper.children[0].getElementsByClassName('scroller-pullUp')[0]
		pullUp.style.display="none";
		// console.log(myScroll)
		this.myScroll.refresh();
	}

	NewIscroll.prototype.refresh = function(){
		this.myScroll.refresh();
	}

	NewIscroll.prototype.gotop=function(x, y, time){	//待完善
		this.myScroll.scrollTo(x, y, time)
	}

	NewIscroll.prototype.goBottom=function(){
		console.log(this.myScroll.maxScrollY)
		this.myScroll.scrollTo(0, this.myScroll.maxScrollY, 0)
	}

	NewIscroll.prototype.scrollToElement=function(el, time, offsetX, offsetY, easing){
		console.log(0)
		this.myScroll.scrollToElement(el, time, offsetX, offsetY, easing)
	}

	NewIscroll.prototype.myScroll=function (){
		return	this.myScroll
	}



	return {
		init:function(options){

			return new NewIscroll(options)

		},
	
	}

});



