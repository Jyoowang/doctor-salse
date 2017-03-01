// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');
    var ScrollUtil = require('../util/scrollUtil');
    var Hospital = require('../components/selectHospital')

    //--------------------------------------------------------
    

    //初始化页面数据
    // initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    // getData(true);

    console.log(Comm.initData);

    function initEvent(){
        Comm.init.back();

        $(".search-but").on('click',function(){
            getData(true);
        });
      

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

        var data = {
            SID:0,
            HospitalName:$("input[name='search']").val(),
            PageIndex:Comm.initData.pageindex,
            PageSize:20
        }

        var isloadObj = {
            loadVal:false,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:true  //布尔值
            }
        } 

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:isloadObj, //页面load

            url:'/SaleApi/GetHospitalAllList', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                 console.log(value);

                Comm.initData.isLoading = false;
                Comm.initData.HospitaData = Comm.Tool.getArray(value,'Hospitals');
               
                if(!Comm.initData.HospitaData.length){
                    Comm.initData.isLoading = true;
                }
                puchselectHospital(value);
                if(Comm.initData.isLoading){
                    Comm.initData.ListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.ListScroll.hideLoding();
                }
            }
        })
    }

    function puchselectHospital(value){
        
        var str='';
        if(Comm.initData.HospitaData.length){
            $.each(Comm.initData.HospitaData,function(){
                str+='<div class="item line-bot" id="'+ this.HospitalID +'">'
                str+='<i class="ion-checkmark-round"></i>'
                str+='<p>'+ this.HospitalName +'</p>'
                str+='</div>'
            })
        }else{
            if (Comm.initData.pageindex == 0) {
                str += '<div class="no-data"><p>( > __ <。)</p><p>暂无此医院信息！</p></div>';
            }
        }

        $(".reg-list-con").append(str)

        //选择医院
        $(".reg-list-con .item").on('click',selectHospitalsEvent)

    }

    function selectHospitalsEvent(){
        var _index = $(this);
        Comm.initData.hosid = ($(this).attr('id'));
        Comm.initData.hosname = encodeURI(($(this).find('p').html()));

        $(this).find('i').show();

        setTimeout(function() {

            Comm.goToUrl({h5Url:'regedit.html?hosid='+Comm.initData.hosid+'&hosname=' + Comm.initData.hosname});

        }, 200)

        // $("input[name='search']").val('')
        // $(".reg-hospital span").html(Comm.initData.SelectHospita.HospitalName)
        // $(".reg-hospital span").css('color','#333')
    }
   


    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
