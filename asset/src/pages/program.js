// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');
    var ScrollUtil = require('../util/scrollUtil');

    //--------------------------------------------------------
    

    //初始化页面数据
    //initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    getData(true);

    // console.log(Comm.initData);

    function initData(){
        Comm.initData.pagesize == 0
    }

    function initEvent(){
        Comm.init.back();
        $('.determine').on('click',function(){
            Comm.goToUrl({h5Url:'addprogram.html?docid='+Comm.initData.docid});
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

    //----------------------------------------------------------------------

    function getData(isload){

        var data={
            method:'QuickSoft.AppService.DoctorService.GetDoctorSchemeList',
            data:{
                doctorid:Comm.initData.docid,
                pageindex:Comm.initData.pageindex,
                pagesize:20
            }
        }

        var isloadObj = {
            loadVal:isload,
            loadView:{
                loadText:false,
                isTransparent:false
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:isloadObj, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                var result =  Comm.Tool.getArray(value.result,'result')
                if(!result.length){
                    Comm.initData.isLoading = true;
                }
                pushAddprogram(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })
    }
   

    //排序
    function sequence(){

        var linkid = $(this).attr('data-linkid');
        var data={
            method:'QuickSoft.AppService.DoctorService.DoctorSchemeSortUp',
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
                $('.product').html('');
                var result =  Comm.Tool.getArray(value.result,'result')
                if(!result.length){
                    Comm.initData.isLoading = true;
                }
                pushAddprogram(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })

    }

    //删除
    function delPro(){
        var data={
            method:'QuickSoft.AppService.DoctorService.DoctorDeleteScheme',
            data:{
                linkid:Comm.initData.linkid
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:true, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                Comm.initData.this.parent().parent('.pro-box').remove();
                if (!$('.product .pro-box').length) {
                    $('#add-btn').hide();
                    var str = '<div class="no-data"><p>( > __ <。)</p><p>没有相关方案！</p></div>';
                    $(".product").append(str);
                }
                $('.pro-box').each(function(index){
                    $(this).find('>span').html(index+1);
                })
                 
            }
        })
    }
    

    function pushAddprogram(value){

        var str=""
        var imgwi=parseInt($(window).width()*0.66);

        if (Comm.Tool.getArray(value.result,'result').length) {

            $.each(Comm.Tool.getArray(value.result,'result'),function(index){

                str +='<div class="pro-box mt10 line-bot">'
                str +='<span>'+ (index+1) +'</span>'
                str +='<div class="pro line-bot">'
                str +='<div class="imgCenter pro_img"><img src="'+Comm.Tool.getPicUrl(this.img,imgwi,0)+' "alt=""><i></i></div>'
                str +='<div class="del"><span>删除</span><i></i></div>'
                str +='</div>'
                str +='<div class="subtotal" data-linkid="'+ this.linkid +'">向上</div>'
                str +='</div>'
            })
        }else{
            if (Comm.initData.pageindex==0) {
                $('#add-btn').hide();
                str+='<div class="no-data"><p>( > __ <。)</p><p>没有相关方案！</p></div>';
            }
        }

        $('.product').append(str);
        $('.subtotal').on('click',sequence);
        $(".del").on('click',function(){
            Comm.initData.this=$(this);
            Comm.initData.linkid = $(this).parent().siblings('.subtotal').attr('data-linkid'); 
            Comm.popupsUtil.init({
                msgText:'是否删除',
                btnType:2,//1 2
                yesEvent:function(){
                    delPro();
                }
            })
        });

    }

    function editPro(e){
        if ($(e.currentTarget).html()=='管理') {
            $(e.currentTarget).html('完成');
            $('.pro .del').animate({'right':0},170);
        }else{
            $(e.currentTarget).html('管理');
            $('.pro .del').animate({'right':'-17%'},170);
        }

    }

   
    //------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
