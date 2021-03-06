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

        // $('input[name=isdefault]').on('click',fansPrice);
    }

    //-------------------------------------------------------------------
   
    function getData(){
        var data = {
                DoctorID: Comm.initData.docid
            };


        Comm.initData.isLoading = true; 

        Comm.firstAjax({
            isload:{loadVal:true}, //页面load

            url:'/SaleApi/GetDoctorRegMsg',  //接口地址

            value:data,     //接口参数 对象

            success:function(value){

                Comm.initData.isLoading = false;
                personalinfo(value);
                
            }
        })
        
    }

    function personalinfo(value){

        if (value.HeadPic) {
            $('.doc-pic img').attr("src",Comm.Tool.getPicUrl(value.PicDomain + value.HeadPic,68,68));
        }else{
            // str +='<img src="../asset/images/public/default_v2.png" alt="">'
        }
        
        //名字
        $(".doc-txt p").html( Comm.Tool.getString(value,'Name'));
        //医院名
        $(".doc-txt span").html(Comm.Tool.getString(value.Hospital,'HospitalName'));
        //用户数
        $('.user-num').html(Comm.Tool.getInt(value,'UserCount'));

        //咨询量
        $('.ask-num').html(Comm.Tool.getInt(value,'TelPhoneCount')+Comm.Tool.getInt(value,'PictextCount'));

        //账户额
        $('.account span').html(Comm.Tool.getInt(value,'WalletMoney'));

        if (value.IsEnjoyFans) {
            $("input[name='isdefault']").prop('checked', true)
        }
       
    }

    // 开放粉丝价
    function fansPrice(){
        var data = {
            DoctorID:Comm.initData.docid
        };

        var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:true  //布尔值
            }
        } 

        Comm.initData.isLoading = true; 

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'/SaleApi/GetChangeEnjoyFans',  //接口地址

            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                
            }
        })
    }
    




   
   //-----------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
