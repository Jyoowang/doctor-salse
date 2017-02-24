
// 所有模块都通过 define 来定义
define(function(require, exports, module) {


	function init(params){

        var defaults = {
            msgText:'',
            topTitle:'提示',
            btnType:1, //1 2
            yesText:'确定',
            noText:'取消',
            yesEvent:function(){
                console.log('确定');
            },
            noEvent:function(){
                console.log('取消');
            }
        };

        if(typeof params != 'object'){
            console.error("参数类型错误 not object");
            return;
        }

        for (var def in params) {
            if (typeof params[def] != 'undefined') {
                defaults[def] = params[def];
            }else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        defaults[def][deepDef] = params[def][deepDef];
                    }
                }
            }
        }

        var oDiv=document.createElement("div");

        oDiv.className='popups-box';
        var oDivContent='<div class="popups-mask"></div><div class="popups-content">';
        oDivContent+='<div class="title line-bot">'+ defaults.topTitle +'</div>';
        oDivContent+='<p>'+ defaults.msgText +'</p>';
        oDivContent+='<div class="button-box line-t row">';
        if(defaults.btnType==1){	//类型,1单按钮
            oDivContent+='<span class="col text-center yes">'+ defaults.yesText +'</span>'
        }else{
            oDivContent+='<span class="col text-center line-r no">'+ defaults.noText +'</span>';
            oDivContent+='<span class="col text-center yes">'+ defaults.yesText +'</span>'
        }

        oDivContent+='</div></div>';

        oDiv.innerHTML = oDivContent;

        document.body.appendChild(oDiv);


        $('.yes').on('click',function(){
            $('.popups-box').remove();
            defaults.yesEvent()
        });
        $('.no').on('click',function(){
            $('.popups-box').remove();
            defaults.noEvent()
        });

	}


	module.exports= {
		init:init,
		remove:function(){
			$('.popups-box').remove();
			// console.log(1)
		}
	}

});

