// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');
    var ScrollUtil = require('../util/scrollUtil');

    //--------------------------------------------------------
    

    //初始化页面数据
    // initData();

    //初始化页面控件事件
    initEvent();

   

    console.log(Comm.initData);

    function initEvent(){
        Comm.init.back();

        Comm.initData.ListScroll = ScrollUtil.init({
            obj:'wrapper',
            scoll:'scroller',
            isLoading:true,
            pullUp:function(){    //下拉
                if (!Comm.initData.isLoading) {
                    Comm.initData.pageindex++;
                    getData(false);
                    console.log(1)
                }
            }
        })

        if (Comm.initData.check) {//未通过
            $('.review span').addClass('fail').html('抱歉，认证未通过');
            $('.review-txt .fai').show();
            getData();
            $('.review-txt >span').html('重新提交').on('click',function(){
                 Comm.goToUrl({h5Url:'regedit.html'});
            })
        }else{//审核中
            $('.review span').addClass('auditing');   
            $('.review-txt .aud').show();
            $('.review-txt >span').on('click',function(){
                 Comm.goToUrl({h5Url:'regedit.html?isView=1?docid='+Comm.initData.docid});
            })
        }

    }

    //----------------------------------------------------------

    function getData(){
       
       var data = {
            DoctorID:Comm.initData.docid
            
        }

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:true, //页面load

            url:'http://api.yuer24h.com/SaleApi/GetExamineFail', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                 if(value.ExamineFailReason){
                    $('.remark').html('备注：' + value.ExamineFailReason );
                }else{
                    $('.remark').hide();
                }
            }
        })
   }




   

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
