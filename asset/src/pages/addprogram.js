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

    //获取页面数据
    getData(true);

    // console.log(Comm.initData);

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
                }
            }
        })
    }

    //-------------------------------------------------------


   function getData(isload){

        var data={
            method:'QuickSoft.AppService.DoctorService.GetDoctorAddSchemeList',
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
                isTransparent:true
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
                pushAddpro(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })
    }

    function pushAddpro(value){

        str = "";
        var imgwi=parseInt($(window).width()*0.66)*2;
        if (Comm.Tool.getArray(value.result,'result').length) {

            $.each(Comm.Tool.getArray(value.result,'result'),function(){

                str +='<div class="pro-box line-bot mb10">'
                str +='<div class="pro line-bot">'
                str +='<div class="pro_img imgCenter"><img src="'+ Comm.Tool.getPicUrl(this.img,imgwi,0) +'" alt=""><i></i></div>'
                str +='</div>'
                
                if (Comm.Tool.getInt(this,'doctorid')) {
                    str +='<div class="subtotal gray">已添加</div>' 
                }else{
                     str +='<div class="subtotal" data-proid="'+ Comm.Tool.getInt(this,'themeid')+'">添加</div>'
                }
          
                str +='</div>'
            })
        }else{
            
            if (Comm.initData.pageindex==0) {
                str+='<div class="no-data"><p>( > __ <。)</p><p>没有相关产品！</p></div>';
            }
        }

        $('.product').append(str);

        $('.subtotal').off('click');
        $('.subtotal').on('click',addPro);
    }

    function addPro(){
        var _this = $(this);
        var proid = _this.attr('data-proid');

         var data={
            method:'QuickSoft.AppService.DoctorService.DoctorAddScheme',
            data:{
                doctorid:Comm.initData.docid,
                themeid:proid
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:{loadVal:true}, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                _this.addClass('gray');
                _this.html('已添加');

            }
        })

    }

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
