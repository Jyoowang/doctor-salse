
// 所有模块都通过 define 来定义
define(function(require, exports, module) {



	// <div class="popups-box">
		// <div class="popups-mask"></div>
		// <div class="popups-content">
		// 	<div class="title line-bot">提示</div>
		// 	<p>您好，请先注册或登录!</p>
		// 	<div class="button-box line-t row">
		// 		<!-- <span class="col text-center">确定</span> -->
		// 		<span class="col text-center line-r">否</span>
		// 		<span class="col text-center">是</span>
		// 	</div>
		// </div>
	// </div>

	var oDiv;


	function init(msg,title,btntype,fun,fun1,yestext,notext){

		oDiv=document.createElement("div");
        var yestext = yestext?yestext:'确定';
        var notext = notext?notext:'取消';

        oDiv.className='popups-box';
        var oDivContent='<div class="popups-mask"></div><div class="popups-content">'
			oDivContent+='<div class="title line-bot">'+ title +'</div>'
			oDivContent+='<p>'+ msg +'</p>'
			oDivContent+='<div class="button-box line-t row">'
			if(btntype==1){	//类型,1单按钮
				oDivContent+='<span class="col text-center yes">'+ yestext +'</span>'
			}else{
				oDivContent+='<span class="col text-center line-r no">'+ notext +'</span>'
				oDivContent+='<span class="col text-center yes">'+ yestext +'</span>'
			}


			oDivContent+='</div></div>';

		oDiv.innerHTML = oDivContent

        document.body.appendChild(oDiv);

  
        $('.yes').on('click',function(){
			$('.popups-box').remove();
			if(fun){
        		fun()
			}
        })
        $('.no').on('click',function(){
        	$('.popups-box').remove();
			if(fun1){
        		fun1()
			}else{
        		return;
			}
        })

        // this.oDiv = oDiv;
	}


	module.exports= {

			init:init,

			remove:function(){
				$('.popups-box').remove()
				// console.log(1)
			}
		}

});

