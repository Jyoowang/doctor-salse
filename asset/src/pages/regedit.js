// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');
    var Comm = require('../common/common');
    var md5 = require('../tool/md5');
    var Hospital = require('../components/selectHospital')
    //--------------------------------------------------------
    
    
    //初始化界面
    //initUi()

    //初始化页面控件事件
    initEvent();

    //初始化页面数据
    initData();
    console.log(Comm.initData);

    function initData(){

        Comm.initData.thisUpload = '';
    	Comm.initData.HeadImg = ''; //医生头像
    	Comm.initData.CertificateImg = ''; //执业或资格证书

    	Comm.initData.PageIndex = 0;
        Comm.initData.SelectHospita = null; //当前医院
        Comm.initData.HospitaData = []; //全部医院
        Comm.initData.RegMess = null; //全部科室
        Comm.initData.Dep = [];  //当前科室
    	Comm.initData.Txt = null; //职称
    }


    function initEvent(){

        Comm.init.back();
        $('.loadbox').hide();

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

    	//返回上一页
    	$(".reg-return").off('click')
    	$(".reg-return,.foot-but").on('click',function(){
    		$(".reg-filter,.bar-hospital,.bar-Departments,.foot-but").hide();
    		$(".reg-list-con").removeClass('reg-list-hospital');
    		$("#scroll").removeClass('doc-reg-bottom')
    	})

    	//显示医院列表
    	$(".reg-hospital").on('click',function(){
    		$(".reg-list-con").html('<p class="reg-list-terms">输入医院名称查询</p>');
    		$(".reg-list-con").addClass('reg-list-hospital');
            $('.reg-filter,.bar-hospital').show();
    	})

    	//搜索医院
    	$(".search-but").on('click',Hospital.selectHospital);

    	//选择科室
    	$(".reg-Departments").on('click',function(){
    		$(".reg-list-con").html('');
    		Hospital.selectDepartments();
            $("#scroll").addClass('doc-reg-bottom');
            $('.reg-filter,.bar-Departments,.foot-but').show();
            
    	})

        //选择职称
        $(".reg-jobTitle").on('click',function(){
            $(".reg-list-con").html('');
            Hospital.selectJobTitle();
            // $("#scroll").addClass('doc-reg-bottom')
            $('.reg-filter,.bar-Departments').show();
            
        })

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


        if (Comm.initData.isView == 1) {//审核中只能看信息            
            $('.item-setpassword,.reg-button').hide();
            $('.title-address').html('医生信息');
            $('input[name=mobile]').attr('readonly','readonly');
            $('input[name=username]').attr('readonly','readonly');
            $(".reg-hospital,.reg-Departments,.reg-jobTitle,.headimg,.certificate,.radio-btn").off("click");
            $('.u-name i').remove();
        }

        if (Comm.initData.addDoc) {//邀请医生不要验证码
            $('.goback,.firstregedittit').show();
           
        }else{
            if (Comm.initData.isView) { //审核中或审核失败
                $('.goback').show();
                getDocinfo();
            } 
        }

        if (Comm.initData.issaoma) {
            $('.item-code,.firstregedittit,').show();
        }
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
                var w = ($(window).width()-32)*0.2;
                $(".headimg,.certificate").height(w);

                $('input[name=mobile]').val(Comm.Tool.getInt(value,'Phone'))
                $('input[name=username]').val(Comm.Tool.getString(value,'Name'))

                //头像
                Comm.Tool.ImgOnload(".headimg", "", value.PicDomain + value.HeadPic);

                //医院
                Comm.initData.SelectHospita = value.Hospital;
                $('.reg-hospital span').html(value.Hospital.HospitalName);

                //科室
                var depart=''
                $.each(Comm.Tool.getArray(value,'Department'),function(index){
                    depart += this.Department;
                    if(value.Department.length-1!=index){
                        depart += ','  
                    }
                })
                Comm.initData.Dep  = value.Department;
                $('.reg-Departments span').html(depart);

                //职称
                Comm.initData.Txt = value.TitleR;
                $('.reg-jobTitle span').html(Comm.Tool.getString(value.TitleR,'Title'))

                //职业证书
                Comm.Tool.ImgOnload(".certificate", "", value.PicDomain + value.CertificatePic);
                $('.reg-Departments span,.reg-jobTitle span,.reg-hospital span').css('color','#464646')


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
        if (!Comm.initData.SelectHospita) { 
            
            Comm.popupsUtil.init({
                msgText:'请选择医院！',
                btnType:1
            });
            return;
        }

        //科室
        if (Comm.initData.Dep==null || Comm.initData.Dep=='') { 
        
            Comm.popupsUtil.init({
                msgText:'请选择科室！',
                btnType:1
            });
            return;
        }

        //职称
        if (!Comm.initData.Txt) { 
            
            Comm.popupsUtil.init({
                msgText:'请选择职称！',
                btnType:1
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

        for(var i=0; i<Comm.initData.Dep.length;i++){
            DepStr.push(Comm.initData.Dep[i].DepartmentID)
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
            Title: Comm.initData.Txt.TitleID,  //职称
            CertificatePic:Comm.initData.CertificateImg,  //执业或资格证书
            HospitalID:Comm.initData.SelectHospita.HospitalID, //医院编号
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
        
        console.log(data);
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
                     Comm.goToUrl({h5Url:'mydoctor.html'});
                }

            },
            error: function (value) {
                console.log(value)
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
  

    $('#inputfile').change(function(){
        Comm.UploadImg("https://www.yuer24h.com/webapi/API/upload_json.ashx", "inputfile", 2, function(value) {
            postIMGCallback(value);
        });
    })

    function postIMGCallback(value) {       
        console.log(value.qiniufilePath);
        if(Comm.initData.thisUpload == 'headimg'){
            var w = ($(window).width()-32)*0.2;
            Comm.initData.HeadImg = value.qiniufilePath
            $(".headimg img").attr("src", Comm.initData.HeadImg);
            $(".headimg").height(w)
            Comm.Tool.ImgOnload(".headimg", "",  value.qiniudomain + value.qiniufilePath);
        }else{
            var w = ($(window).width()-32)*0.2*1.55;
            Comm.initData.CertificateImg = value.qiniufilePath
            $(".certificate img").attr("src", value.qiniudomain + value.qiniufilePath);
            $(".certificate").height(w)
            Comm.Tool.ImgOnload(".certificate", "",  Comm.initData.CertificateImg);
        } 
    }



    
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
