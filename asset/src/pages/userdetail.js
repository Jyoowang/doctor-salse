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
    getData();

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
    }

    //-------------------------------------------------------


   function getData(isload){

        var data={
            method:'QuickSoft.AppService.DoctorService.GetDoctorUserOrderList',
            data:{
                userid:Comm.initData.sid,
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
                pushUserdetail(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
                   
            }
        })
    }

    function pushUserdetail(value){

        str = "";
       
        if (Comm.Tool.getArray(value,'result').length) {

            $.each(Comm.Tool.getArray(value,'result'),function(){

                str +='<div class="public-list line-bot">'
                str +='<div class="detail_left">'
                str +='<dl>'
                str +='<dt>'+Comm.Tool.getString(this,'prodname')+'</dt>'
                str +='<dd>'+ this.created.replace('T',' ') +'</dd>'
                str +='</dl>'
                str +='</div>'
                str +='<div class="detail_right">'
                str +='<p class="color_red">'+ Comm.Tool.getPrice(this,'totalprice')+'元</p>'
                str +='</div></div>'
            })
        }else{
            
            if (Comm.initData.pageindex==0) {
                str+='<div class="no-data"><p>( > __ <。)</p><p>暂无消费信息！</p></div>';
            }
        }

        $('.wallts').append(str);

    }


   

   
    //-----------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
