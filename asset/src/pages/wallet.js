// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');

    //--------------------------------------------------------
    

    //初始化页面数据
    // initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    getData();

    console.log(Comm.initData);

    function initEvent(){
        Comm.init.back();
        $('.walletdetail').on('click',function(){
            Comm.goToUrl({h5Url:'walletdetail.html'});
        })

    }

    function getData(){

        var data = {
            SaleID:Comm.initData.sid
        }

        Comm.initData.isLoading = true; 

        Comm.firstAjax({
            isload:{loadVal:true}, //页面load

            url:'/SaleApi/GetPersonalCenterWealth',  //接口地址

            value:data,     //接口参数 对象

            success:function(value){

                Comm.initData.isLoading = false;
                $('.price').html(Comm.Tool.getString(value,"WalletMoney"));
                
            }
        })
    }


   

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
