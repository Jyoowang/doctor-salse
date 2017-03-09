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
    //initEvent();

    //获取页面数据
     getData();

    // console.log(Comm.initData);

    //--------------------------------------------------------------

    function getData(){

        var data ={
            SID:Comm.initData.sid
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

            url:'/SaleApi/GetSaleQRCode', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                
                //头像
                $('.doc-pic img').attr("src",Comm.Tool.getPicUrl(value.PicDomain + value.HeadPic,70,70));
                //名字
                $(".doc-txt p").html(Comm.Tool.getString(value,'Name'));
                //医院名
                $(".doc-txt span").html(Comm.Tool.getString(value,'Title'));
                //二维码
                $(".code img").attr('src',value.QRCodeImg);        
               
            }
        })

    }
   

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
