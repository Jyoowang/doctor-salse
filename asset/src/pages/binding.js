// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');

    //--------------------------------------------------------
    

    //初始化页面数据
    initData()

    //初始化页面控件事件
    initEvent();


    console.log(Comm.initData)

    function initData(){
    	Comm.initData.code = 60; //默认倒计时时间
        Comm.initData.iTime = null;
    }


    function initEvent(){
        
	    // 获取焦点or失去焦点
    	$(".inpTxt").focus(function(){
	    	$(this).siblings('i').show()
	    })

	    $(".inpTxt").blur(function() {
	        var con = $(this).siblings('i');
	        setTimeout(function() {
	            con.hide()
	        }, 200)
	    })

	    //清空input值
	    $(".ion-close-circled").on('click',function(){
	    	$(this).siblings('input').val('')
	    })

	    //立即注册
	    $(".reg-button").on('click',getButton)

	    //获取验证码
	    $(".code").on('click',clickCode)
    }

    // 完成注册
    function getButton(){

    	var inpMobile = $("input[name='mobile']").val()
	    var inpCode = $("input[name='code']").val()
	    var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

    	if (!reg.test(inpMobile)) {  //手机号验证
	        Comm.popupsUtil.init('请输入正确的手机号码！', '提示', 1, function() {
	            $("input[name='mobile']").focus()
	        });
	        return
	    }
	  
    	if (inpCode == '') {  //验证码
	        Comm.popupsUtil.init('请输入验证码！', '提示', 1, function() {
	            $("input[name='code']").focus()
	        });
	        return
	    }

	    var data = {
    		OpenID:Comm.initData.openid,
    		Phone:inpMobile,
    		VCode:inpCode,
    	}

    	var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'http://api.yuer24h.com/app/ZHT/GetZHTDoctorBind', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
            	Comm.initData.isLoading = false;
                //跳转注册成功页
            	if(value.JumpType==1){ //1完善信息 2注册成功
                    Comm.goToUrl({
                        h5Url:'regedit.html?uid=' + Comm.initData.uid
                    });
                }else{
                    Comm.goToUrl({
                        h5Url:'download.html?uid=' + Comm.initData.uid
                    });
                }
            },
            error: function (value) {
                console.log(value)
            }
        })
    }

    //获取验证码
    function clickCode(){

    	var inpMobile = $("input[name='mobile']").val();
    	var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;

    	if (!reg.test(inpMobile)) {  //手机号验证
	        Comm.popupsUtil.init('请输入正确的手机号码！', '提示', 1, function() {
	            $("input[name='mobile']").focus()
	        });
	        return
	    }

	    if (Comm.initData.code == 60) {
            getCode();
        }

    }


    //倒计时
    function timer() {
        if (Comm.initData.code >= 0) {
            $(".code").html(Comm.initData.code + '秒后重发');
            $(".code").addClass('cur');
            Comm.initData.code--;
            Comm.initData.iTime = setTimeout(timer,1000);
        } else {
            Comm.initData.code = 60;
            $(".code").on('click',clickCode);
            $(".code").removeClass('cur');
            $(".code").html('获取验证码');
        }
    };
    
    //获取验证码
    function getCode(){
    	var inpMobile = $("input[name='mobile']").val();
    	var data = {
    		Phone:inpMobile,
    	}
    	var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:true  //布尔值
            }
        } 

        $(".code").off('click');

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'http://api.yuer24h.com/app/ZHT/GetVCode', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
            	Comm.initData.isLoading = false;
            	Comm.initData.code = 60;
                clearTimeout(Comm.initData.iTime);
            	timer();
            }

        })
    }

    

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
