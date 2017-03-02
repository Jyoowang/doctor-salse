// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');
    var Comm = require('../common/common');
    var md5 = require('../tool/md5');
    // var Hospital = require('../components/selectHospital')
    var ScrollUtil = require('../util/scrollUtil');

    //--------------------------------------------------------
    //初始化页面控件事件
    initEvent();
    
    //初始化界面
    initUi()


    //初始化页面数据
    initData();

    function initData(){

        Comm.initData.thisUpload = '';
    	Comm.initData.HeadImg = ''; //医生头像
    	Comm.initData.CertificateImg = ''; //执业或资格证书

        Comm.initData.currHospita = {HospitalID:0}; //当前医院
        Comm.initData.HospitaData = []; //全部医院


        Comm.initData.DepartmentData = []; //全部科室
        Comm.initData.currDepartment = [];  //当前科室


        Comm.initData.titleData = null; //职称
        Comm.initData.currTitleClass = {id:0}; //职称级别
    	Comm.initData.currTitle = {id:0}; //职称级别
    }

    function initUi(){

        if (Comm.initData.isView == 1) {//审核中只能看信息            
            $('.item-setpassword,.reg-button').hide();
            $('.title-address').html('医生信息');
            $('input[name=mobile]').attr('readonly','readonly');
            $('input[name=username]').attr('readonly','readonly');
            $(".reg-hospital,.reg-Departments,.reg-jobTitle,.headimg,.certificate,.radio-btn,.reg-jobLevel").off("click");
            $('.item i').remove();
        }

        if (Comm.initData.addDoc) {//销售添加医生不要验证码
            $('.goback,.firstregedittit').show();
        }else{
            if (Comm.initData.isView) { //审核中或审核失败
                $('.goback').show();
                getDocinfo(); //获取注册信息
            } 
        }

        if (Comm.initData.issaoma) { //医生注册 //显示验证码，完善资料title
            $('.item-code,.firstregedittit,').show();
        }


    }

    function initEvent(){

        Comm.init.back();


        Comm.initData.hospitalListScroll = ScrollUtil.init({
            obj:'hospital-box',
            scoll:'hospital-list',
            isLoading:true,
            pullUp:function(){    //下拉
                if (!Comm.initData.isLoading) {
                    Comm.initData.pageindex++;
                    getHospital(false)
                    console.log(1)
                }
            }
        })


        // 获取焦点or失去焦点
        $(".inpTxt").focus(function(){
            $(this).siblings('i').show()
        })

        $(".inpTxt").blur(function() {
            var con = $(this).siblings('i');
            setTimeout(function() {
                con.hide()
            }, 200)
        })

	    //清空input值
	    $(".ion-close-circled").on('click',function(){
	    	$(this).siblings('input').val('')
	    })



        $('#search').blur(function () {
            var sVal = $.trim($('.search-input-box input').val());
            if (sVal == '') {
                $('.search-input i').hide();
            };
        });

        $('#search').bind('input propertychange', function () {
            // console.log($(this).val());
            var valStr = $(this).val();
            if (valStr != '') {
                $('.search-input-box i').show();

            }
        });
        $("#search").on('keypress', function (e) {
            var keycode = e.keyCode;
            if (keycode == '13') {
                e.preventDefault();

                Comm.initData.pageindex = 0;
                Comm.initData.hospitalData = [];
                $('.hospital-list').html('');
                //请求搜索接口
                getHospital(true);
            }
        });


        //搜索
        $('.reg-hospital').on('click',hospitalSearch);

        $('.search-input >span').on('click',searchEvent);
        
        $('.search-input-box .ion-ios-close').on('click', function () {
            $('#search').val('');
            $('#search').focus();
            $('.search-input-box i').hide();
        });

        $('.hospital-search .ion-ios-arrow-left').on('click',function(){
            $('.hospital-search').hide();
        })

        // //选择科室
        $(".reg-Departments").on('click', selectDepartment)


        $('.public-select,.close-layer').on('click',function(){
            $('.select-list-public').hide();
            $('.public-select').show();
            $('.select-list-public').removeClass('dep-top');
        })


        //选择职称
        $(".reg-jobTitle").on('click',selectTitleClass)


        $(".reg-jobLevel").on('click',selectTitle)


    	//保存信息
    	$(".reg-button").on('click',getSave);

        //选择头像
        $('.headimg').on('click', function () {
            Comm.initData.thisUpload='headimg';
            $("#inputfile").click()
        });

        //选择资格证书
        $('.certificate').on('click', function () {
            Comm.initData.thisUpload='certificate';
            $("#inputfile").click()
        });

        //选择平台、是否用户端
        $(".radio-btn").on('click',radioSelect);


        $('#inputfile').change(function(){
            Comm.UploadImg("https://www.yuer24h.com/webapi/API/upload_json.ashx", "inputfile", 2, function(value) {
                console.log(value.qiniudomain);
                Comm.initData.qiniudomain = value.qiniudomain
                postIMGCallback(value);
            });
        })


    }


    function selectTitle(){

        if(Comm.initData.currTitleClass.id==0){
            Comm.popupsUtil.init({
                msgText: '请先选择职务名称',
                yesEvent: function () {
                    return;
                }
            });
            return;
        }else{
            $('.select-list-public').show();
            $('.select-list-public .title').html('选择职务级别');
            $('.public-list-s').html('');
            pushTitleHTML();
        }

    }

    function pushTitleHTML(){
        var str=''
        var currData = Comm.initData.currTitleClass.list
        if(currData.length){
            $.each(currData,function(){
                str += '<li class="line-bot';

                if (Comm.initData.currTitle.id == this.id) {
                    str += ' cur';
                }
    
                str += '">';
                str += '<p>' + this.name + '</p>';
                str += '<span class="ion-checkmark top-bottom-center"></span>';
                str += '</li>'
            })
        }else{
            str += '<div class="no-data"><p>( > __ <。)</p><p>暂无数据！</p></div>'
        }
        $('.public-list-s').append(str);
        $('.public-list-s li').off('click');
        $('.public-list-s li').on('click', selcetTitleEvent)
    }

    function selcetTitleEvent(){
        $('.public-list-s li').removeClass('cur');
        $(this).addClass('cur');
        var _index = $(this).index();
         var currData = Comm.initData.currTitleClass.list
        Comm.initData.currTitle = currData[_index];

        $('.reg-jobLevel span').html(Comm.initData.currTitle.name);
        $('.reg-jobLevel span').css({'color':'#464646'})
        setTimeout(function () {
            $('.select-list-public').hide();
        }, 300)

    }

// /////

    function selectTitleClass(){
        $('.select-list-public').show();
        $('.select-list-public .title').html('选择职务名称');
        $('.public-list-s').html('');
        getTitleData();
    }


    function getTitleData(){
        Comm.loadingUtil.show({isTransparent:true})
        Comm.initData.isLoading = true;
        $.ajax({  
            url: Comm.ApiUrls + "/SaleApi/GetSaleDoctorBasicsReg", 
            type: "GET",
            dataType: "jsonp",
            success: function(value){

                Comm.loadingUtil.hide();

                Comm.initData.isLoading = false;

                Comm.initData.titleData = value;

                pushTitleClassHTML();

           }
        });
    }

    function pushTitleClassHTML(){
        var str=''
        if(Comm.initData.titleData.length){
            $.each(Comm.initData.titleData,function(){
                str += '<li class="line-bot';

                if (Comm.initData.currTitleClass.id == this.id) {
                    str += ' cur';
                }
    
                str += '">';
                str += '<p>' + this.name + '</p>';
                str += '<span class="ion-checkmark top-bottom-center"></span>';
                str += '</li>'
            })
        }else{
            str += '<div class="no-data"><p>( > __ <。)</p><p>暂无数据！</p></div>'
        }
        $('.public-list-s').append(str);
        $('.public-list-s li').off('click');
        $('.public-list-s li').on('click', selcetTitleClassEvent)

    }

    function selcetTitleClassEvent(){
        $('.public-list-s li').removeClass('cur');
        $(this).addClass('cur');

        var _index = $(this).index();
        Comm.initData.currTitleClass = Comm.initData.titleData[_index];

        Comm.initData.currTitle = {id:0}; //职称级别
        $('.reg-jobLevel span').html('职称级别');
        $('.reg-jobLevel span').css({'color':'#aaa'})

        $('.reg-jobTitle span').html(Comm.initData.currTitleClass.name);
        $('.reg-jobTitle span').css({'color':'#464646'})
        setTimeout(function () {
            $('.select-list-public').hide();
        }, 300)

    }


//////////////////////////////////

    //选择科室
    function selectDepartment(){
        $('.select-list-public').show();
        $('.public-select').show();
        $('.select-list-public').addClass('dep-top');
        $('.select-list-public .title').html('选择科室(最多选择三项)');
        $('.public-list-s').html('');
        getDepartmentData();
    }

    //获取科室数据
    function getDepartmentData(){

        Comm.loadingUtil.show({isTransparent:true})
        Comm.initData.isLoading = true;
        $.ajax({  
            url: Comm.ApiUrls + "/SaleApi/GetRegMess", 
            type: "GET",
            dataType: "jsonp",
            success: function(value){

                Comm.loadingUtil.hide();

                Comm.initData.isLoading = false;

                Comm.initData.DepartmentData = Comm.Tool.getArray(value,'DepR');

                pushDepRHTML();

           }
        });
    }
    //遍历科室html
    function pushDepRHTML(value){

        var str=''
        if(Comm.initData.DepartmentData.length){
            $.each(Comm.initData.DepartmentData,function(){
                str += '<li class="line-bot';
                for(var i=0; i<Comm.initData.currDepartment.length;i++){
                    if (Comm.initData.currDepartment[i].DepartmentID == this.DepartmentID) {
                        str += ' cur';
                    }
                }
                str += '">';
                str += '<p>' + this.Department + '</p>';
                str += '<span class="ion-checkmark top-bottom-center"></span>';
                str += '</li>'
            })
        }else{
            str += '<div class="no-data"><p>( > __ <。)</p><p>暂无数据！</p></div>'
        }
        $('.public-list-s').append(str);
        $('.public-list-s li').off('click');
        $('.public-list-s li').on('click', selcetDepartmentEvent)

    }
    //选择科室事件
    function selcetDepartmentEvent(){

        // $('.public-list-s li').removeClass('cur');
        

        var _index = $(this).index();
        var currDepartment = Comm.initData.DepartmentData[_index];

        if(isItemExist(Comm.initData.currDepartment,currDepartment)){
            $(this).removeClass('cur');
            Comm.initData.currDepartment = removeDepartmentArrayItem(Comm.initData.currDepartment,currDepartment)

        }else{
            if(Comm.initData.currDepartment.length<3){
                $(this).addClass('cur');
                Comm.initData.currDepartment.push(currDepartment);
            }else{
                Comm.popupsUtil.init({
                    msgText: '科室最多只能选择三项',
                    yesEvent: function () {
                        return;
                    }
                });
            }
        }

        // console.log(Comm.initData.currDepartment)

        if(Comm.initData.currDepartment.length){
            var str='';

            $.each(Comm.initData.currDepartment,function(i){
                if(i!=0){
                    str+=',';
                }
                str += this.Department
            });

            $('.reg-Departments span').html(str);
            $('.reg-Departments span').css({'color':'#464646'})
        }else{
            $('.reg-Departments span').html('科室');
            $('.reg-Departments span').css({'color':'#aaa'})
        }

        // setTimeout(function () {
        //     $('.select-list-public').hide();
        // }, 300)

    }

    //判断是否存在
    function isItemExist(array, item) {
        var isExist = false;
        for (var i = 0; i < array.length; i++) {
            if (item.DepartmentID == array[i].DepartmentID) {
                isExist = true;
            }
        }
        return isExist;
    }

    //删除医生数组的元素
    function removeDepartmentArrayItem(array, item) {
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            if (item.DepartmentID != array[i].DepartmentID) {
                arr.push(array[i]);
            }
        }
        return arr;
    }



// //////////////////////////////
    //搜索
    function hospitalSearch(){
        $('#search').val('');
        $('.hospital-list').html('')
        $('.Tip').show();

        $('.hospital-search').show()
        Comm.initData.pageindex = 0;
        Comm.initData.HospitaData=[];
    }

    //医院搜索事件
    function searchEvent(){
        var inputText = $.trim($('.search-input-box input').val());

        if(inputText==''){
            Comm.popupsUtil.init({
                msgText: '请输入医院名称',
                yesEvent: function () {
                    $('.search-input-box input').focus();
                }
            });
        }else{
            getHospital(true);
        }
        
    }

    //获取医院数据
    function getHospital(isload){
        var inputText = $.trim($('.search-input-box input').val());
        var data = {
            HospitalName:inputText,
            PageIndex:Comm.initData.pageindex,
            PageSize:20
        }

        var isloadObj = {
            loadVal:isload,
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

                var HospitaData = Comm.Tool.getArray(value,'Hospitals');

                if(!HospitaData.length){
                    Comm.initData.isLoading = true;
                }

                if(Comm.initData.pageindex==0){
                    Comm.initData.HospitaData =  HospitaData;
                }else{
                    Comm.initData.HospitaData = Comm.initData.HospitaData.concat(HospitaData);
                }

                puchHospitalHTML(value);

                if(Comm.initData.isLoading){
                    Comm.initData.hospitalListScroll.ArraynNullHideLoding()
                }else{
                    Comm.initData.hospitalListScroll.hideLoding();
                }
            }
        })
    }

    //遍历医院节点
    function puchHospitalHTML(value){
        var HospitaData = Comm.Tool.getArray(value,'Hospitals');
        var str = '';
        if (HospitaData.length) {
            $.each(HospitaData, function () {
                str += '<li class="line-bot';
                if (Comm.initData.currHospita.HospitalID == this.HospitalID) {
                    str += ' cur';
                }
                str += '">';
                str += '<p>' + this.HospitalName + '</p>';
                str += '<span class="ion-checkmark top-bottom-center"></span>';
                str += '</li>'
            });
        } else {
            if (Comm.initData.pageindex == 0) {
                str += '<div class="no-data"><p>( > __ <。)</p><p>暂无医院数据！</p></div>'
            }
        }
        if (Comm.initData.pageindex == 0) {
            // $('.hospital-list').html('');
            $('.Tip').hide();
        }

        $('.hospital-list').append(str);
        $('.hospital-list li').off('click');
        $('.hospital-list li').on('click', selcetHospitalEvent)
    }

    //选择医院
    function selcetHospitalEvent(){

        $('.hospital-list li').removeClass('cur');
        $(this).addClass('cur');

        var _index = $(this).index();
        Comm.initData.currHospita = Comm.initData.HospitaData[_index];

        $('.reg-hospital span').html(Comm.initData.currHospita.HospitalName);
        $('.reg-hospital span').css({'color':'#464646'})
        setTimeout(function () {
            $('.hospital-search').hide();
        }, 300)

        console.log(Comm.initData.currHospita)
    }

//==============================================================
    
    //获取注册信息
    function getDocinfo(){
        var data = {
            DoctorID:Comm.initData.docid
        }

        Comm.initData.isLoading = true;

        Comm.firstAjax({
            isload:true, //页面load

            url:'/SaleApi/GetDoctorRegMsg', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);


                $('input[name=mobile]').val(Comm.Tool.getInt(value,'Phone'))
                $('input[name=username]').val(Comm.Tool.getString(value,'Name'))

                //头像
                if(value.HeadPic){
                    Comm.initData.HeadImg = value.HeadPic;
                    $(".headimg img").attr("src", Comm.Tool.getPicUrl(value.PicDomain + value.HeadPic,70,70) );
                }

                //医院
                Comm.initData.currHospita = value.Hospital
                $('.reg-hospital span').html(value.Hospital.HospitalName);

                //科室
                var depart=''
                $.each(Comm.Tool.getArray(value,'Department'),function(index){
                    depart += this.Department;
                    if(value.Department.length-1!=index){
                        depart += ','  
                    }
                })
                Comm.initData.currDepartment  = value.Department;

                $('.reg-Departments span').html(depart);


                //职务名称
                if(value.RoleItem){
                    Comm.initData.currTitleClass = value.RoleItem ;
                    $('.reg-jobTitle span').html(value.RoleItem.name);
                    $('.reg-jobTitle span').css('color','#464646')
                    //职称级别
                    if(Comm.initData.currTitle){
                        Comm.initData.currTitle = value.TitleItem;
                        $('.reg-jobLevel span').html(value.TitleItem.name)
                        $('.reg-jobLevel span').css('color','#464646')
                    }
                }

                //职业证书
                if(value.CertificatePic){
                    Comm.initData.CertificateImg = value.CertificatePic 
                    $(".certificate img").attr("src", value.PicDomain + value.CertificatePic);
                }

                $('.reg-Departments span,.reg-hospital span').css('color','#464646')


                //注册平台
                 if (value.RegDoctorChannel==2) {//育儿

                    $('.platform input[name="channel-name"]').eq(0).attr('checked', true);
                    $(".platform .radio-btn").eq(0).addClass('checkedRadio')
                }else if (value.RegDoctorChannel==4) {//安建宝
                    $(".platform .radio-btn").eq(1).addClass('checkedRadio')
                    $('.platform .radio-btn').eq(0).removeClass('checkedRadio');
                    $('.platform input[name="channel-name"]').eq(1).attr('checked', true);
                }

                //是否用户端
                if(value.IsEnable==1){  //1显示
                    $(".isShow .radio-btn").eq(0).addClass('checkedRadio')
                    $('.isShow input[name="radio-btn"]').eq(0).attr('checked', true);                  
                }else{  //2不显示
                    $(".isShow .radio-btn").eq(0).removeClass('checkedRadio')
                    $(".isShow .radio-btn").eq(1).addClass('checkedRadio')
                    $('.isShow input[name="radio-btn"]').eq(1).attr('checked', true);
                }
            }
            
            
        })
    }

    //保存信息验证
    function getSave(){

        //手机
        var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test($("input[name='mobile']").val())) {
            Comm.popupsUtil.init({
                msgText:'请输入正确的手机号码!',
                btnType:1,
                yesEvent:function(){
                    $("input[name='mobile']").focus();
                }
            });
            return;
        }

    	//验证码验证
        if (Comm.initData.issaoma) {
            if ($('input[name=code]').val() == '') { 
                
                Comm.popupsUtil.init({
                    msgText:'请输入验证码!',
                    btnType:1,
                    yesEvent:function(){
                        $("input[name='code']").focus();
                    }
                });
                return;
            }
        }

        //密码验证
        if ($('input[name=password]').val() == '') { 
            Comm.popupsUtil.init({
                msgText:'请输入密码!',
                btnType:1,
                yesEvent:function(){
                    $("input[name='password']").focus();
                }
            });
            return;
        }

        //注册平台
      
        Comm.initData.channel = $("input:radio[name='channel-name']:checked").val();
        if(!Comm.initData.channel){
            Comm.popupsUtil.init({
                msgText:'请选择注册平台！',
                btnType:1,
                yesEvent:function(){
                    return;
                }
            });
            return;
            
        }
     

        //姓名验证
    	if ($('input[name=username]').val() == '') { 
            
            Comm.popupsUtil.init({
                msgText:'请输入姓名！',
                btnType:1,
                yesEvent:function(){
                    $("input[name='username']").focus();
                }
            });
            return;
        }

        //医院
        if (!Comm.initData.currHospita.HospitalID) { 
            
            Comm.popupsUtil.init({
                msgText:'请选择医院！',
            });
            return;
        }

        //科室
        if (!Comm.initData.currDepartment.length) { 
        
            Comm.popupsUtil.init({
                msgText:'请选择科室！',
            });
            return;
        }

        //职称
        if (!Comm.initData.currTitleClass.id) { 
            
            Comm.popupsUtil.init({
                msgText:'请选择职务名称！',
            });
            return;
        }
        //职称
        if (!Comm.initData.currTitle.id) { 
            
            Comm.popupsUtil.init({
                msgText:'请选择职称级别！',
            });
            return;
        }

        //用户端显示
        Comm.initData.IsEnable = $("input:radio[name='radio-btn']:checked").val();
          	
        addDocInfo();

    }

    //保存信息提交
    function addDocInfo(){

        $(".reg-button").off('click');

        var DepStr=[];

        for(var i=0; i<Comm.initData.currDepartment.length;i++){
            DepStr.push(Comm.initData.currDepartment[i].DepartmentID)
        }

        var data = {
            SID:Comm.initData.sid, //销售编号         
            Phone: $('input[name=mobile]').val(), //手机号
            Password: md5($('input[name=password]').val()),  //密码
            VCode: $('input[name=yzm]').val(), //验证码
            HeadPic:Comm.initData.HeadImg, //头像
            Name:$('input[name=username]').val(),  //医生姓名
            // PID:AddreEvent.Province,  //省份编号
            // CID: AddreEvent.City,  //城市编号
            DepartmentID: DepStr.toString(), //科室 多个用英文逗号隔开
            RoleTitleID:Comm.initData.currTitleClass.id ,//职务名称
            Title: Comm.initData.currTitle.id,  //职称级别
            CertificatePic:Comm.initData.CertificateImg,  //执业或资格证书
            HospitalID:Comm.initData.currHospita.HospitalID, //医院编号
            IsEnable:Comm.initData.IsEnable,//是否用户端显示
            RegDoctorChannel:Comm.initData.channel//选择注册平台
        }

        var isloadObj = {
            loadVal:true,
            loadView:{
                loadText:false, // false   字符串
                isTransparent:false  //布尔值
            }
        }
        
        // console.log(data);
        Comm.initData.isLoading = true;
       
        Comm.firstAjax({
            isload:isloadObj, //页面load
            url:'/SaleApi/GetSaleDoctorReg', //接口地址
            value:data,     //接口参数 对象

            success:function(value){
                Comm.initData.isLoading = false;
                console.log(value);

                if (Comm.initData.issaoma) {
                    WeixinJSBridge.call('closeWindow');
                }else{
                     Comm.goToUrl({h5Url:'mydoctor.html?sid='+Comm.initData.sid});
                }
            }
        })
    }

    function radioSelect(){
        var _this = $(this),
        block = _this.parent().parent();
        block.find('input[type="radio"]').attr('checked', false);
        block.find(".radio-btn").removeClass('checkedRadio');
        _this.addClass('checkedRadio');
        _this.find('input[type="radio"]').attr('checked', true);
    }
  

    function postIMGCallback(value) {       
        console.log(value.qiniufilePath);
        if(Comm.initData.thisUpload == 'headimg'){
            Comm.initData.HeadImg = value.qiniufilePath
            $(".headimg img").attr("src", Comm.Tool.getPicUrl(value.qiniudomain + value.qiniufilePath,70,70) );
        }else{
            Comm.initData.CertificateImg = value.qiniufilePath
            $(".certificate img").attr("src", value.qiniudomain + value.qiniufilePath);
     
        } 
    }

    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
