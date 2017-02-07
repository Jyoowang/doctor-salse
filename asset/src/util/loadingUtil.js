
// 所有模块都通过 define 来定义
define(function(require, exports, module) {


	var oDiv;

	!(function(){

		oDiv=document.getElementsByClassName("loadbox");
		if (oDiv&&oDiv.length>0) {
			oDiv = oDiv[0];
		}else{
			oDiv=document.createElement("div");
        
	        oDiv.className='loadbox';
	        oDiv.innerHTML='<div class="load-main"><i></i><p>加载中...</p></div>';

	        // link.setAttribute("type", "text/css");
	        // link.setAttribute("href", url);
	        document.body.appendChild(oDiv);
		}
        // this.oDiv = oDiv;
	})()


	module.exports= {

			show:function(can){  //显示是控制loading 

				if(can){
					if(can.loadText){ //loadText load文本 默认false
						oDiv.getElementsByTagName('p')[0].innerHTML = can.loadText
					}
					if(can.isTransparent){ //isTransparent 布尔值 背景透明
						// console.log(oDiv.style)
						oDiv.style.background="none"
					}
				}else{
					oDiv.getElementsByTagName('p')[0].innerHTML = '加载中...'
				}
				
				oDiv.style.display="block"
				// console.log(oDiv)
			},
			hide:function(){
				oDiv.style.display="none"
				// console.log(1)
			}
		}

});

