// 所有模块都通过 define 来定义
define(function (require, exports, module) {

    // var $ = require('jquery');

    var Tool = require('../tool/tool.js');

    var loading = require('../util/loadingUtil.js');

    var popups = require('../util/popupsUtil.js');

    var ApiUrl = 'http://webapi.yuer24h.com/API/HttpToSoap.aspx';

    var TrackApiUrl = "http://webapi.yuer24h.com/API/Track/TrackReceive.ashx";
    //var ApiUrl='http://webapitest.yuer24h.com/API/HttpToSoap.aspx'
    var ApiUrls = 'http://api.yuer24h.com';
    // var ApiUrls='http://218.80.0.87:8016'

    var urls = 'view';

    var common = {
        //初始化
        pageUrl: 'http://www.yuer24h.com/zht_doc/',

        init: {
            back: function () {
                $('.goback').on('click', function () {
                    window.history.back();
                })
            },

        },
        initData: {
            isLoading: false,	//数据是否请求完成
            pageindex: 0,
            sid: Tool.SessionAttr.getSwssionAttr('sid'),
            sourceData: Tool.locationObject()
        },
        //判断并赋值url传的值
        isLocationData: function () {
            if (this.initData.sourceData) {
                for (var i in this.initData.sourceData) {
                    if (this.initData.sourceData[i]) {
                        this.initData[i] = this.initData.sourceData[i];
                        if (i == 'sid') {
                            Tool.SessionAttr.setSwssionAttr(i, this.initData.sourceData[i])
                        }
                    }
                }
            }
        },

        //接口调用
        Ajax: function (params) {

            var defaults = {   //默认值

                isload: true,  //页面菊花 默认调用接口需要load
                url: ApiUrl, 	//接口地址
                value: {}, //接口参数
                success: function (value) {
                    console.log(value)
                },
                error: function (value) {
                    console.log(value)
                },
                errorError: function (xhr, status, err) {
                    console.log(value)
                },

            }

            function initTransfer() {

                if (defaults.isload.loadVal) {
                    loading.show(defaults.isload.loadView);
                }
                ;

                defaults.value['appid'] = '';
                defaults.value['sign'] = '';
                defaults.value['timestamp'] = '';

                $.ajax({
                    url: defaults.url,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "text",
                    type: 'Post',
                    async: true,
                    data: JSON.stringify(defaults.value),
                    success: function (response) {
                        //TOTO 整体接口返回判断
                        //关闭菊花
                        if (defaults.isload) {
                            loading.hide();
                        }
                        ;

                        var data = JSON.parse(response);

                        if (data.error > 0) {
                            defaults.success(data);
                        } else {
                            if (data.message) {
                                if (defaults.error) {
                                    defaults.error();
                                }
                                popups.init({
                                    msgText:data.message,
                                    topTitle:'提示',
                                    yesEvent:function(){
                                        console.log('确定');
                                    },
                                    noEvent:function(){
                                        console.log('取消');
                                    }
                                })
                                // alert(data.message);
                            } else {
                                // alert('系统错误！');
                                popups.init({
                                    msgText:data.message,
                                    topTitle:'提示',
                                    yesEvent:function(){
                                        console.log('确定');
                                    },
                                    noEvent:function(){
                                        console.log('取消');
                                    }
                                })
                            }

                            //弹出窗口
                        }
                    },
                    error: function (xhr, status, err) {
                        if (defaults.errorError) {
                            defaults.errorError(xhr, status, err);
                        }
                        if (err) {
                            console.log(err.toString());
                        }
                        ;
                        //弹出系统异常
                    }
                })

            }

            if (typeof params != 'object') {
                console.error("参数类型错误 not object");
                return;
            }

            for (var def in params) {
                if (typeof params[def] != 'undefined') {
                    defaults[def] = params[def];
                } else if (typeof params[def] === 'object') {
                    for (var deepDef in defaults[def]) {
                        if (typeof params[def][deepDef] === 'undefined') {
                            defaults[def][deepDef] = params[def][deepDef];
                        }
                    }
                }
            }

            // console.log(defaults)

            initTransfer();


        },

        //接口调用
        firstAjax: function (params) {

            var defaults = {   //默认值

                isload: true,  //页面菊花 默认调用接口需要load
                url: '', 	//接口地址
                value: {}, //接口参数
                success: function (value) {
                    console.log(value)
                },
                error: function (value) {
                    console.log(value)
                },
                errorError: function (xhr, status, err) {
                    console.log(value)
                },

            }

            function initTransfer() {

                if (defaults.isload.loadVal) {
                    loading.show(defaults.isload.loadView);
                };

                $.ajax({
                    url: defaults.url,
                    type: "POST",
                    dataType: "jsonp",
                    data: defaults.value,
                    success: function (response) {
                        //TOTO 整体接口返回判断
                        //关闭菊花
                        if (defaults.isload) {
                            loading.hide();
                        }
                        ;

                        if (response.ResultCode > 0) {
                            defaults.success(response);
                        } else {
                            // ResultMessage
                            if (response.ResultCode) {
                                if (defaults.error) {
                                    defaults.error();
                                }
                                popups.init({
                                    msgText:data.message,
                                    topTitle:'提示',
                                    yesEvent:function(){
                                        console.log('确定');
                                    },
                                    noEvent:function(){
                                        console.log('取消');
                                    }
                                })
                                // alert(data.message);
                            } else {
                                // alert('系统错误！');
                                popups.init({
                                    msgText:data.message,
                                    topTitle:'提示',
                                    yesEvent:function(){
                                        console.log('确定');
                                    },
                                    noEvent:function(){
                                        console.log('取消');
                                    }
                                })
                            }
                        }
                    },
                    error: function (xhr, status, err) {
                        if (defaults.errorError) {
                            defaults.errorError(xhr, status, err);
                        }
                        if (err) {
                            console.log(err.toString());
                        }
                        ;
                        //弹出系统异常
                    }
                });
            }

            if (typeof params != 'object') {
                console.error("参数类型错误 not object");
                return;
            }

            for (var def in params) {
                if (typeof params[def] != 'undefined') {
                    defaults[def] = params[def];
                } else if (typeof params[def] === 'object') {
                    for (var deepDef in defaults[def]) {
                        if (typeof params[def][deepDef] === 'undefined') {
                            defaults[def][deepDef] = params[def][deepDef];
                        }
                    }
                }
            }

            // console.log(defaults)
            initTransfer();


        },
        UploadImg: function (requestUrl, objId, optionsTeg, fun) {
            // console.log(requestUrl,objId,fun)
            //创建FormData对象
            var formData = new FormData();
            //为FormData对象添加数据
            var filesizeAllow = false;

            var fileObj = document.getElementById(objId).files[0];

            // $.each($("#fileId")[0].files, function(i, file) {
            // 	console.log(file)
            //     if (Number(file.size) > 2 * 1024 * 1024) {
            //         filesizeAllow = true;
            //     }
            // });

            //      if (filesizeAllow) {
            // Comm.popupsUtil.init('上传图像大于2M,上传失败！','上传提醒',1,function(){
            // 	Comm.popupsUtil.remove()
            // })
            //          return;
            //      }

            if (optionsTeg == 1) {
                formData.append("savemode", "1");
            } else {
                formData.append("savemode", "2");
                formData.append("source", "2");
            }


            formData.append('file', fileObj);
            loading.show();
            $.ajax({
                url: requestUrl,
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (response) {
                    loading.hide();
                    var data = JSON.parse(response);
                    if(data.error>0){
                        fun(data)
                    }
                    // console.log(data)
                },
                error: function (xhr, status, err) {
                    //弹出系统异常
                }
            })

        },
        UploadVoice: function (requestUrl, blob, classid, fun) {
            // console.log(requestUrl,objId,fun)
            //创建FormData对象
            var fileType = 'audio'; // or "audio"
            var fileName = 'ABCDEF.webm';  // or "wav" or "ogg"

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-blob', blob);
            formData.append('courseid', classid);

            loading.show();
            $.ajax({
                url: requestUrl,
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false, //不可缺
                processData: false, //不可缺
                success: function (response) {
                    loading.hide();
                    var data = JSON.parse(response);
                    fun(data)
                    // console.log(data)
                },
                error: function (xhr, status, err) {
                    //弹出系统异常
                }
            })

        },
        //页面跳转
        goToUrl: function (UrlVale) {

            this.isApp(function () {
                var temp = Tool.getModel(UrlVale, 'appUrl');
                if (temp) {
                    Tool.yuer24hGoto(temp)
                }
            }, function () {
                var temp = Tool.getString(UrlVale, 'h5Url');
                if (temp) {
                    window.location = '' + UrlVale.h5Url
                }

            })
        },
        goToAdminUrl: function (pageName) {
            window.location = '' + pageName
        },

        isShare: function (fun1, fun2) {
            if (this.initData.isShare) {
                if (fun1) {
                    fun1();
                }
            } else {
                if (fun2) {
                    fun2();
                }
            }
        },
        isApp: function (fun1, fun2) {
            if (this.initData.isApp) {
                //app
                if (fun1) {
                    fun1();
                }
            } else {
                if (fun2) {
                    fun2();
                }
            }
        },
        //注册事件
        addEvent: function (Element, eventType, fun1) {
            Element.on(eventType, function () {

                if (fun1) {
                    fun1();
                }
            })
        },
        sendTrack: function (userid, trackelement, trackevent, tracktype, trackcode, trackvalue) {
            if (!userid || userid == null) userid = 0;
            var senddata = {
                method: "QuickSoft.AppService.TrackService.TrackReceive",

                userid: userid,
                trackelement: trackelement,//填写版本号
                trackevent: trackevent,//add,click,view等
                tracktype: tracktype,//app,button,a,page等
                trackcode: trackcode,//doctoropen useropen
                trackvalue: trackvalue,//安卓，//IOS,//H5
                pageurl: window.location.href,
                appid: "3",//1,安卓,2.IOS，3.H5
                sign: "",
                timestamp: ""
            }
            $.ajax({
                url: TrackApiUrl,
                type: "post",
                dataType: "text",
                data: senddata,
                success: function (response) {

                }
            });
        },

        Tool: Tool,
        popupsUtil: popups,
        loadingUtil: loading,
        ApiUrl: ApiUrl,
        ApiUrls: ApiUrls
    }


    //获取url 上的值，并保存在 页面数据对象内
    common.isLocationData()

    module.exports = common

})

