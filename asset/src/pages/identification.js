// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');


    //--------------------------------------------------------
    

    //初始化页面数据
    //initData();

    //初始化页面控件事件
    initEvent();   

    console.log(Comm.initData);

    function initEvent(){

        Comm.init.back();
        if (Comm.initData.check) {//未通过 2
            $('.fai').show();
            $('.review p img').attr('src','../asset/images/black-white/authenticate_inc02.png');
            $('.review p span').html('抱歉，认证未通过');
            $('.re-contact p').append('<span>客服邮箱：fuwu@yuer24h.com</span><span>微信客服：请添加微信号 yuer24h</span>'); 
            $('.review-txt .aud').hide();
            getData();
            $('.review-txt >span').html('重新提交').on('click',function(){
                 Comm.goToUrl({h5Url:'regedit.html?isView=2&docid='+Comm.initData.docid});            
            })
        }else{//审核中 1
            $('.loadbox').hide();
            $('.aud').show();
            $('.review span').addClass('auditing');   
            $('.review-txt .fai').hide();
            $('.review-txt >span').on('click',function(){
                Comm.goToUrl({h5Url:'regedit.html?isView=1&docid='+Comm.initData.docid});
            });
            
        }

    }

    //----------------------------------------------------------

    function getData(){
       
        var data = {
            DoctorID:Comm.initData.docid            
        }

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:{loadVal:true}, //页面load

            url:'http://api.yuer24h.com/SaleApi/GetExamineFail', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                 if(value.ExamineFailReason){
                    $('.retroaction').html('备注：' + value.ExamineFailReason );
                }else{
                    $('.retroaction').hide();
                }
            }
        })
   }




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
