// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');

    //--------------------------------------------------------
    
    
    //获取页面数据
    getData();

    //初始化页面控件事件
    initEvent();

    function initEvent(){
        Comm.init.back();
        $('.user-a').on('click',function(){
            Comm.goToUrl({h5Url:'userlist.html?docid=' + Comm.initData.docid});
        })

        // $('.account').on('click',function(){
        //     Comm.goToUrl({h5Url:'account.html'});
        // })

        $('.prolist').on('click',function(){
            Comm.goToUrl({h5Url:'prolist.html?docid=' + Comm.initData.docid});
        })

        $('.program').on('click',function(){
            Comm.goToUrl({h5Url:'program.html?docid=' + Comm.initData.docid});
        })

        $('.toggle').on('click',fansPrice);
    }

    //-------------------------------------------------------------------
   
    function getData(){
        var data = {
                DoctorID: Comm.initData.docid
            };


        Comm.initData.isLoading = true; 

        Comm.firstAjax({
            isload:{loadVal:true}, //页面load

            url:'http://api.yuer24h.com/SaleApi/GetDoctorRegMsg',     //接口地址

            value:data,     //接口参数 对象

            success:function(value){

                Comm.initData.isLoading = false;
                console.log(value);
                personalinfo(value);
                
            }
        })
        
    }

    function personalinfo(value){
        
        Comm.Tool.ImgOnload(".doc-pic", "", value.PicDomain + value.HeadPic);
        $(".docinfo .col p").html('<p>'+ Comm.Tool.getString(value,'Name')+'<br><span>'+ Comm.Tool.getString(value.Hospital,'HospitalName') +'</span></p>');

        $('.user-num').html(Comm.Tool.getInt(value,'UserCount'));//用户数
        $('.ask-num').html(Comm.Tool.getInt(value,'PictextCount'));//咨询量
        $('.account span').html(Comm.Tool.getInt(value,'WalletMoney'));//账户额

        if (value.IsEnjoyFans) {
            $("input[name='isdefault']").prop('checked', true)
        }
       
    }

    // 开放粉丝价
    function fansPrice(){
        var data = {
            DoctorID:Comm.initData.docid
        };

        Comm.initData.isLoading = true; 

        Comm.firstAjax({
            isload:{loadVal:false}, //页面load

            url:'http://api.yuer24h.com/SaleApi/GetChangeEnjoyFans',     //接口地址

            value:data,     //接口参数 对象

            success:function(value){

                Comm.initData.isLoading = false;
                
            }
        })
    }
    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
