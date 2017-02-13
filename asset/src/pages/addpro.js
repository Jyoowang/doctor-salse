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
    }
   
   //-------------------------------------------------------------


    function getData(isload){

        var data={
            method:'QuickSoft.AppService.DoctorService.GetDoctorAddProductList',
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
                console.log(value);
                var result =  Comm.Tool.getArray(value,'result')
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

        str = ""
        if (Comm.Tool.getArray(value,'result').length) {

            $.each(Comm.Tool.getArray(value,'result'),function(index){

                str +='<div class="pro-box line-bot">'
                str +='<div class="pro line-bot">'
                str +='<div class="pro-pic imgCenter"><img src="'+ this.smallimg +'" alt=""><i></i></div>'
                str +='<div class="pro-txt">'
                str +='<p class="many-text-overflow">'+ Comm.Tool.getString(this,'productname') +'</p>'
                str +='<span>售价：'+ Comm.Tool.getInt(this,'originalprice') +'元</span>'
                str +='</div>'

                if (Comm.Tool.getInt(this,'doctorid')) {
                    str +='<div class="isadd gray" data-proid="'+ Comm.Tool.getInt(this,'productid')+'">已添加</div>' 
                }else{
                     str +='<div class="isadd" data-proid="'+ Comm.Tool.getInt(this,'productid')+'">添加</div>'
                }
               
                str +='</div>'
                str +='</div>'
            })
        }else{
            
            if (Comm.initData.pageindex==0) {
                str+='<div class="no-data"><p>( > __ <。)</p><p>没有相关产品！</p></div>';
            }
        }

        $('.product').append(str);
        $('.isadd').on('click',addPro);
    }

    function addPro(){
        var _this = $(this)
        var proid = _this.attr('data-proid')

         var data={
            method:'QuickSoft.AppService.DoctorService.DoctorAddProduct',
            data:{
                doctorid:Comm.initData.docid,
                productid:proid
            }
        }

        Comm.initData.isLoading = true;

        Comm.Ajax({
            isload:true, //页面load
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);
                _this.addClass('gray');
                _this.html('已添加');
            }
        })

    }

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
