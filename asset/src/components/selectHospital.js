define(function(require, exports, module) {
    var $ = require('jquery');
    var Comm = require('../common/common');
    var loading = require('../util/loadingUtil.js');

    var Component = {};

    //搜索医院
    Component.selectHospital = function(value) {
        var data = {
            SID:0,
            HospitalName:$("input[name='search']").val(),
            PageIndex:Comm.initData.PageIndex,
            PageSize:20
        }

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

            url:'/SaleApi/GetHospitalAllList', //接口地址
            value:data,     //接口参数 对象

            success:function(value){

                Comm.initData.isLoading = false;

                Comm.initData.HospitaData = Comm.initData.HospitaData.concat(value.Hospitals);

                Component.puchselectHospital(value,Comm.initData.PageIndex)
                
            }
        })

    }

    Component.puchselectHospital = function(value,pageindex){

        var str='';
        

        var Hospitals = Comm.Tool.getArray(value,'Hospitals')

        if(Hospitals.length){
            $.each(Hospitals,function(){
                str+='<div class="item line-bot" id="'+ this.HospitalID +'">'
                str+='<i class="ion-checkmark-round"></i>'
                str+='<p>'+ this.HospitalName +'</p>'
                str+='</div>'
            })
        }else{
            if (pageindex == 0) {
                str += '<div class="no-data"><p>( > __ <。)</p><p>暂无此医院信息！</p></div>';
            }
        }

        $(".reg-list-con").html(str)

        //选择医院
        $(".reg-list-con .item").on('click',Component.selectHospitalsEvent)
        
    }


    Component.selectHospitalsEvent = function(){

        Comm.initData.SelectHospita=Comm.initData.HospitaData[$(this).index()]
        console.log(Comm.initData.SelectHospita)

        $(this).find('i').show();

        setTimeout(function() {

            $(".reg-filter,.bar-hospital").hide()

        }, 200)

        $("input[name='search']").val('')
        $(".reg-hospital span").html(Comm.initData.SelectHospita.HospitalName)
        $(".reg-hospital span").css('color','#333')
    }





    //选择科室
    Component.selectDepartments = function(value){
        // var data = null;
        var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:true  //布尔值
            }
        } 
        Comm.initData.isLoading = true;
        if (isloadObj.loadVal) {
            loading.show(isloadObj.loadView);
        };
        $.ajax({  
            isload:isloadObj, //页面load
            url: "http://api.yuer24h.com/SaleApi/GetRegMess", 
            type: "POST",
            dataType: "jsonp",
            // data: value,
          
            success: function(value){

                if (isloadObj.loadVal) {
                    loading.hide();
                };

                Comm.initData.isLoading = false;

                Comm.initData.RegMess = value;

                Component.addDepEvent();

           }
        });
    }


    Component.addDepEvent = function(){

        console.log(Comm.initData.RegMess)

        $(".bar-Departments .title").html('选择科室(最多选择三项)')
        $(".reg-list-con").html(Component.pushDepartmentsHTML(Comm.initData.RegMess,Comm.initData.PageIndex));

        $(".reg-list-con .item").on('click',function(){
            var text=''
            var _thisInfo = Comm.initData.RegMess.DepR[$(this).index()]
            if($(this).hasClass('round-on')){
                $(this).removeClass('round-on')
                $(this).find('i').hide();
                Comm.initData.Dep = Component.arrayRemove(Comm.initData.Dep,_thisInfo.DepartmentID)
            }else{
                if(Comm.initData.Dep.length != 3){
                    $(this).addClass('round-on')
                    $(this).find('i').show();
                    Comm.initData.Dep.push(_thisInfo)
                }else{
                    Comm.popupsUtil.init({
                        msgText:'科室最多只能选择三项',
                        btnType:1,
                    });
                }
            }
            console.log(Comm.initData.Dep)
            if(Comm.initData.Dep.length){
                
                $.each(Comm.initData.Dep,function(index) {
                    text+= this.Department
                    if(Comm.initData.Dep.length-1!=index){
                        text += ','  
                    }        
                })
               $(".reg-Departments span").css('color','#333')
            }else{
                text='科室'
               $(".reg-Departments span").css('color','#aaa')
            }

            $(".reg-Departments span").html(text)

        });

    }


    Component.arrayRemove = function(arr,id){
        var i=0;
        var attr=[];
        for(var s=0; s < arr.length; s++){
            if(arr[s].DepartmentID != id){
                attr.push(arr[s])
            }
        }
        return attr;
    }

    Component.pushDepartmentsHTML = function(value,pageindex){
        var str='';
        var depIdArray=[];
        var DepR = Comm.Tool.getArray(value,'DepR');

        if(Comm.initData.Dep.length){
            $.each(Comm.initData.Dep, function(index) {  //遍历dep ID
                depIdArray.push(this.DepartmentID);
            })
        }
        console.log(Comm.initData.Dep);
        if(DepR.length){
            $.each(DepR,function(){
                str += '<div class="item line-bot ';
                var isNone='none'
                if(Comm.initData.Dep.length){
                    if(depIdArray.indexOf(this.DepartmentID)!=-1){  //查询是否存在
                        str+='round-on';
                        isNone='block'
                    }
                }
                str+='" data-dep-id="'+ this.DepartmentID +'">'
                str+='<i class="ion-checkmark-round" style="display:'+ isNone +'" ></i>'
                str+='<p>'+ this.Department +'</p>'
                str+='</div>'
            })
        }else{
            if (pageindex == 0) {
                str += '<div class="no-data"><p>( > __ <。)</p><p>暂无此科室信息！</p></div>';
            }
        }

        return str
    }


    //选择职称
    Component.selectJobTitle = function(){
        // var data = null;
        var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:true  //布尔值
            }
        } 
        Comm.initData.isLoading = true;
        if (isloadObj.loadVal) {
            loading.show(isloadObj.loadView);
        };
        $.ajax({  
            url: "http://api.yuer24h.com/SaleApi/GetRegMess", 
            type: "POST",
            dataType: "jsonp",
            // data: value,
            success: function(value){
                if (isloadObj.loadVal) {
                    loading.hide();
                };
                Comm.initData.isLoading = false;

                console.log(value)
                Comm.initData.RegMess = value;

                Component.addJobTitleEvent();

           }
        });
    }

    Component.addJobTitleEvent = function(){
        $(".bar-Departments .title").html('选择职称')
        $(".reg-list-con").html(Component.pushJobTitleHTML(Comm.initData.RegMess,Comm.initData.PageIndex));
        $(".reg-list-con .item").on('click',function(){
            var text='职称'
            if($(this).hasClass('round-on')){
                $(this).removeClass('round-on');
                $(this).find('i').hide();
                $(".reg-jobTitle span").css('color','#aaa')
                Comm.initData.Txt = null;
            }else{
                $(this).addClass('round-on');
                $(this).find('i').show();
                Comm.initData.Txt = Comm.initData.RegMess.TitleR[$(this).index()]
                text=Comm.initData.Txt.Title;
                $(".reg-jobTitle span").css('color','#333')
            }

            $(".reg-jobTitle span").html(text)
            setTimeout(function() {
                $('.reg-filter,.bar-Departments').hide();
                // $(".reg-return").on('click')
            }, 200)

        })

    }


    Component.pushJobTitleHTML = function(value,pageindex){
        var str='';
        var TitleR = Comm.Tool.getArray(value,'TitleR');

        if(TitleR.length){
            $.each(TitleR,function(){
                var isNone='none'
                str += '<div class="item line-bot '

                if(Comm.initData.Txt){
                    if(Comm.initData.Txt.TitleID == this.TitleID){  
                        str+='round-on';
                        isNone='block'
                    }
                }
                str+='" data-title-id="'+ this.TitleID +'">'
                str+='<i class="ion-checkmark-round" style="display:'+ isNone +'" ></i>'
                str+='<p>'+ this.Title +'</p>'
                str+='</div>'
            })
        }else{
            if (pageindex == 0) {
                str += '<div class="no-data"><p>( > __ <。)</p><p>暂无此职称信息！</p></div>';
            }
        }

        return str
    }




    module.exports = Component;
});
