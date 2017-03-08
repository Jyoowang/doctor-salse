
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    var wx = require('jweixin');


    window.share = {}
    window.share = {
        title: '宝宝和妈妈的健康都在这',
        desc: '还有育儿微课堂、24小时医生咨询随时随地',
        link: 'http://api.yuer24h.com/app/Share/GetCode?target=8_0_0_0_0',
        imgUrl: 'http://www.yuer24h.com/wechat2/images/btn/logo_inc.png'
    }
    //alert(window.location.origin + window.location.pathname + window.location.search)
    var href = encodeURIComponent(window.location.href);
    //var href = window.location.href;

    wx_post({
        url: "http://api.yuer24h.com/wxapi/GetWXJSConfig?url=" + href,
        //data: JSON.stringify({ url: href }),
        success: function (response) {
            var data = JSON.parse(response);
            WXConfig(data)
        },
        error: function (data) {
        }
    })

    function WXConfig(data){
        
        wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.nonce,
            signature: data.signature,
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'showOptionMenu', 'hideOptionMenu','chooseImage', 'previewImage', 'startRecord', 'stopRecord', 'uploadVoice', 'downloadVoice']
        });
        wx.ready(function () {

            // wx.hideOptionMenu();
            // return false;
            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            //document.querySelector('#checkJsApi').onclick = function() {
            wx.checkJsApi({
                jsApiList: ['getNetworkType', 'previewImage'],
                success: function (res) {

                    console.log(JSON.stringify(res));
                }
            });
            //};

            window.share_wx_api()
            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            //document.querySelector('#onMenuShareAppMessage').onclick = function () {

        });

        wx.error(function (res) {
            console.log(res.errMsg);
        });
    }

    window.share_wx_api = function () {
        wx.onMenuShareAppMessage({
            title: window.share.title,
            desc: window.share.desc,
            link: window.share.link,
            imgUrl: window.share.imgUrl,
            trigger: function (res) {
                console.log('用户点击发送给朋友');
            },
            success: function (res) {
                //alert(window.share.imgUrl.match(/(Wechat_share_){1,}\w/g)[0])
                console.log('已分享');
            },
            cancel: function (res) {
                console.log('已取消');
            },
            fail: function (res) {
                console.log(JSON.stringify(res));
            }
        });
        //console.log('已注册获取“发送给朋友”状态事件');
        // };

        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        //document.querySelector('#onMenuShareTimeline').onclick = function() {
        wx.onMenuShareTimeline({
            title: window.share.desc,
            link: window.share.link,
            imgUrl: window.share.imgUrl,
            trigger: function (res) {
                console.log('用户点击分享到朋友圈');
            },
            success: function (res) {
                console.log('已分享');
            },
            cancel: function (res) {
                console.log('已取消');
            },
            fail: function (res) {
                console.log(JSON.stringify(res));
            }
        });
        //console.log('已注册获取“分享到朋友圈”状态事件');
        //};

        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        //document.querySelector('#onMenuShareQQ').onclick = function() {
        wx.onMenuShareQQ({
            title: window.share.desc,
            desc: window.share.desc,
            link: window.share.link,
            imgUrl: window.share.imgUrl,
            trigger: function (res) {
                console.log('用户点击分享到QQ');
            },
            complete: function (res) {
                console.log(JSON.stringify(res));
            },
            success: function (res) {
                console.log('已分享');
            },
            cancel: function (res) {
                console.log('已取消');
            },
            fail: function (res) {
                console.log(JSON.stringify(res));
            }
        });
        ////console.log('已注册获取“分享到 QQ”状态事件');
        //	};

        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        //document.querySelector('#onMenuShareWeibo').onclick = function() {
        wx.onMenuShareWeibo({
            title: window.share.desc,
            desc: window.share.desc,
            link: window.share.link,
            imgUrl: window.share.imgUrl,
            trigger: function (res) {
                console.log('用户点击分享到微博');
            },
            complete: function (res) {
                console.log(JSON.stringify(res));
            },
            success: function (res) {
                console.log('已分享');
            },
            cancel: function (res) {
                console.log('已取消');
            },
            fail: function (res) {
                console.log(JSON.stringify(res));
            }
        });
        //console.log('已注册获取“分享到微博”状态事件');
        //};
        var shareData = {
            title: window.share.desc,
            desc: window.share.desc,
            link: window.share.link,
            imgUrl: window.share.imgUrl
        };
        //wx.onMenuShareAppMessage(shareData);
        //wx.onMenuShareTimeline(shareData);
        wx.showOptionMenu();
    }


    function wx_post(value) {
        var local, xmlHttp;
        
        if(window.ActiveXObject){
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }else if(window.XMLHttpRequest){
            xmlHttp = new XMLHttpRequest();
        }
        
        try {
            xmlHttp.open("GET",value.url,true);
        } catch (e) {
            onError(e);
        }
        // console.log(value.url)
        local = (value.url.indexOf('file:') === 0 || (window.location.href.indexOf('file:') === 0 && value.url.indexOf('http') === -1));

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200 || local && xmlHttp.status === 0) {
                    value.success(xmlHttp.responseText);
                } else {
                    if (value.error) {
                        value.error();
                    }
                }
            }
        };
        xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        try {
            xmlHttp.send(null);
        } catch (e) {
            if (value.error) {
                value.error(e);
            }
        }
    };

    // module.exports = common

})
