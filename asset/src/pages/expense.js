// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    //----Quote----------------------------------------------------
    require('../common/wx');

    var $ = require('jquery');

    var Comm = require('../common/common');

    //--------------------------------------------------------
    

    //初始化页面数据
    // initData();

    //初始化页面控件事件
    initEvent();

    //获取页面数据
    // getData();

    console.log(Comm.initData);

    function initEvent(){
        Comm.init.back();
        
    }


   

    




   
    //------------------------------------------------------------------------


    // 或者通过 module.exports 提供整个接口
    // module.exports = ...

});
