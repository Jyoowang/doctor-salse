
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

	function NewIscroll(options){

		this.options=options

		this.scrollBox = document.getElementById(this.options.obj)
	    this.scollObj=document.getElementById(this.options.scoll);


	    this.isBottom=false;
	    this.isTop=false;

	    //下拉;
	    if(this.options.dropDown){
	    	this.scrollBox.scrollTop=1;
	    };

		if(this.options.isLoading){
			var oDiv=document.createElement("div");
	        oDiv.className='scroller-loding';
	        oDiv.innerHTML='<img src="../asset/images/public/loading.gif" /><span>加载更多...</span>';
	        this.scrollBox.appendChild(oDiv);
		}
	 
	    var scrollTops=0; //
	    var pageHeight=this.scrollBox.offsetHeight; //滑动区域的高度
	    var objHeight=0; //滑动内容区域的高度

	    var _this = this;

	    this.scrollBox.onscroll=function(){

	       scrollTops = _this.scrollBox.scrollTop;

	       objHeight=_this.scollObj.offsetHeight;

	       // console.log(scrollTops)
	       //判断是否滑动到最顶部,执行
	       if(scrollTops<=0){ 
	            if(_this.options.dropDown){

	                _this.options.dropDown();

	                if(!_this.isTop){
		                $('#' + _this.options.obj + ' .scroller-loding').fadeIn();
	                	_this.isTop=true;
	                }

	            };
	       }

	       pageHeight=_this.scrollBox.offsetHeight;


	       //判断 top 是否大于或等于可滑动距离
	       if(scrollTops>=(objHeight-pageHeight)){ 

	            if(_this.options.pullUp){
	            	
	                _this.options.pullUp();

	                if(!_this.isBottom){
		                $('#' + _this.options.obj + ' .scroller-loding').fadeIn();
		                _this.isBottom=true;

	                }

	            };
	       }



	    }



	}


	NewIscroll.prototype.hideLoding = function(){
    	$('#' + this.options.obj + ' .scroller-loding').fadeOut();
    	this.isBottom=false;
    	this.isTop=false;
	}

	NewIscroll.prototype.ArraynNullHideLoding = function(msg){
		var _msg='已经到最底部'
		if(msg){
			_msg = msg
		}

		$('#' + this.options.obj + ' .scroller-loding').html('<span>'+ _msg +'</span>')

    	$('#' + this.options.obj + ' .scroller-loding').fadeOut(1000);
    	this.isBottom=true;
    	this.isTop=true;
	}

	NewIscroll.prototype.goBottom = function(){
    	var boxHei=this.scrollBox.offsetHeight
    	var conHei=this.scollObj.offsetHeight
    	if(conHei>boxHei){
    		this.scrollBox.scrollTop=conHei-boxHei
    	}
	}

	NewIscroll.prototype.gotop = function(){
		this.scrollBox.scrollTop=0;
	}





	module.exports= {

		init : function (options) {
			return new NewIscroll(options)
		}

	}
});

