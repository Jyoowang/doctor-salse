// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');
    var ScrollUtil = require('../util/scrollUtil');


    //--------------------------------------------------------
    

    //初始化页面数据
     initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    getData(true);

    console.log(Comm.initData);

    function initData(){
        Comm.initData.pageindex = 1;
    }

    function initEvent(){
        Comm.init.back();
        $('.determine').on('click',function(){
            Comm.goToUrl({h5Url:'addpro.html?docid='+ Comm.initData.docid});
        })
        $('#add-btn').on('click',editPro);

        Comm.initData.ListScroll = ScrollUtil.init({
            obj:'wrapper',
            scoll:'scroller',
            isLoading:true,
            pullUp:function(){    //下拉
                if (!Comm.initData.isLoading) {
                    Comm.initData.pageindex++;
                    getData(false);
                }
            }
        })
    }

//---------------------------------------------------------------------

    function getData(isload){
           
        var data={
            method:'QuickSoft.AppService.DoctorService.GetDoctorProductList',
            data:{
                doctorid:Comm.initData.docid,
                pageindex:Comm.initData.pageindex,
                pagesize:15
            }
        }

        var isloadObj = {
            loadVal:isload,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:isloadObj, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                var result =  Comm.Tool.getArray(value,'result')
                if(!result.length){
                    Comm.initData.isLoading = true;
                }
                pushProList(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })
    }
   
    

    //升序
    function sequence(){
        var linkid = $(this).attr('data-linked');  
        var data={
            method:'QuickSoft.AppService.DoctorService.DoctorProductSortUp',
            data:{
                doctorid:Comm.initData.docid,
                linkid:linkid
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:true, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                $('.product').html('');
                var result =  Comm.Tool.getArray(value,'result')
                if(!result.length){
                    Comm.initData.isLoading = true;
                }
                pushProList(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })
    }

    
    function pushProList(value){

        var str = "";
        if (Comm.Tool.getArray(value,'result').length) {

            $.each(Comm.Tool.getArray(value,'result'),function(index){

                str +='<div class="pro-box mt10 line-bot" data-proid="'+ Comm.Tool.getInt(this,'productid')+'">'
                str +='<span>'+ (index+1) +'</span>'
                str +='<div class="pro line-bot">'
                str +='<div class="pro-pic imgCenter"><img src="'+ this.smallimg +'" alt=""><i></i></div>'
                str +='<div class="pro-txt">'
                str +='<p class="many-text-overflow">'+ Comm.Tool.getString(this,'productname') +'</p>'
                str +='<span>售价：'+ Comm.Tool.getInt(this,'originalprice') +'元</span>'
                str +='</div>'
                str +='<div class="del"><span>删除</span><i></i></div>'
                str +='</div>'
                str +='<div class="turntop" data-linked="'+ Comm.Tool.getInt(this,'linkid')+'">'
                str +='<p><em>向上</em>小计（共售'+ Comm.Tool.getInt(this,'productcnt') +'件）：<span>￥'+ Comm.Tool.getInt(this,'totalprice') +'</span></p>'
                str +='</div>'
                str +='</div>'
                
            })
        }else{
            if (Comm.initData.pageindex==1) {
                str+='<div class="no-data"><p>( > __ <。)</p><p>没有相关产品！</p></div>';
            }
        }

        $(".product").append(str);
        $(".turntop").on('click',sequence);
        $(".del").on('click',delPro);
    }
    
    //删除
    function delPro(){
        var _this=$(this)
        var linkid = _this.parent().siblings('.turntop').attr('data-linked');  
        console.log(linkid);
        var data={
            method:'QuickSoft.AppService.DoctorService.DoctorDeleteProduct',
            data:{
                linkid:linkid
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:true, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                _this.parent().parent('.pro-box').remove();
                console.log($('.product .pro-box').length);
                if (!$('.product .pro-box').length) {
                    var str = '<div class="no-data"><p>( > __ <。)</p><p>没有相关产品！</p></div>';
                    $(".product").append(str);
                }
                $('.pro-box').each(function(index){
                    $(this).find('>span').html(index+1);
                })

                Comm.popupsUtil.init(value.message,'系统提示',1)
                 
            }
        })
    }


    function editPro(e){
        if ($(e.currentTarget).html()=='管理') {
            $(e.currentTarget).html('完成');
            $('.pro .del').animate({'right':0},170);
        }else{
            $(e.currentTarget).html('管理');
            $('.pro .del').animate({'right':'-18%'},170);
        }

    }


   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
