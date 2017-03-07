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

    //----------------------------------------------------------------------
   
    function getData(isload){
       
        var data = {
            DID:Comm.initData.docid,
            PageIndex:Comm.initData.pageindex,
            PageSize:20
        }

        var isloadObj = {
            loadVal:isload,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'/SaleApi/GetMySaleDoctorUserList', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                var SaleDoctorUserList =  Comm.Tool.getArray(value,'SaleDoctorUserList')
                if(!SaleDoctorUserList.length){
                    Comm.initData.isLoading = true;
                }
                pushUserList(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
               
            }
        })
   }

   function pushUserList(value){

        var str = ''
        if (Comm.Tool.getArray(value,'SaleDoctorUserList').length) {

            $.each(Comm.Tool.getArray(value,'SaleDoctorUserList'),function(){

                str +='<div class="user-item line-bot" data-doc-id="'+ Comm.Tool.getInt(this,'DoctorID')+'" data-exam-id="'+ Comm.Tool.getInt(this,'Examine')+'">'
                str +=' <div class="user-pic fl">'
                str +='<img src="'+Comm.Tool.getPicUrl(value.PicDomain + this.HeadPic,70,70) +'" alt="">'
                str +='</div>'
                str +='<div class="user-txt fl">'
                str +='<p class="info">'
                str +='<i>'+ Comm.Tool.getString(this,'Name')+'</i>'
                if(this.IsRegInvi){
                    str+='<img src="../asset/images/public/star-on.png" alt="">'
                }
                str +='</br><span>'+ Comm.Tool.getString(this,'BabyAge')+'</span></p>'
               
                str += '</div>'
                str +='</div>'
            })
        }else{
            if (Comm.initData.pageindex==0) {
               str+='<div class="no-data"><p>( > __ <。)</p><p>暂无粉丝信息！</p></div>'; 
            }
            
        }

        $('.userlist').append(str);
        $('.user-item').on('click',function(){
             Comm.goToUrl({h5Url:'userdetail.html?docid=' + Comm.initData.docid});
        })
   }

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
