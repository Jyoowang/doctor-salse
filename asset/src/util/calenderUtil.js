// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    var DatePicker = {

        currentDate: null

    };

    // Default View.
    DatePicker = {
        el: null,
        mouth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        /*
         * ui制作
         */
        boundary: null,
        callback: function(value) {},
        setDate: function(value) {

        },

        //data='2014-1'
        intbtn: function() {
            

            // this.el.find('.next').click($.proxy(this.nextmouth, this));
            // this.el.find('.pre').click($.proxy(this.premouth, this));

            // this.el.find('.nextY').click($.proxy(this.nextYear, this));
            // this.el.find('.preY').click($.proxy(this.preYear, this))

        },
        init: null,
        nextmouth: function() {
            //var tt = this.el.find('.y_m').html().split('-');
            var tt = DatePicker.currentDate.split('-');
            var ui;
            //console.log(tt);
            if (Number(tt[1]) == 12) {
                ui = (Number(tt[0]) + 1) + '-1'
            } else {
                ui = Number(tt[0]) + '-' + ('0' + (Number(tt[1]) + 1)).slice(-2)
            }
            DatePicker.currentDate=ui;
            DatePicker.callback(ui)
        },
        premouth: function() {
            var tt = DatePicker.currentDate.split('-');
            var ui;
            if (Number(tt[1]) == 1) {
                ui = (Number(tt[0]) - 1) + '-12'
            } else {
                ui = Number(tt[0]) + '-' + ('0' + (Number(tt[1]) - 1)).slice(-2)
            }
            DatePicker.currentDate=ui;
            DatePicker.callback(ui)
        },
        nextYear: function() {
            //console.log(DatePicker.currentDate);
            var tt = DatePicker.currentDate.split('-');
            var ui = (Number(tt[0]) + 1) + '-' + Number(tt[1]);

            this.callback(ui)
        },
        preYear: function() {
            var tt = DatePicker.currentDate.split('-');
            var ui = (Number(tt[0]) - 1) + '-' + Number(tt[1]);
            this.callback(ui)
        },
        chooseDay: function(e) {
            var ww = DatePicker.currentDate.split('-');
            //var ww = this.el.find('.y_m').html();
            /*if (this.boundary > new Date(ww[0], ww[1] - 1, $(e.currentTarget).find('p').html()).getTime()) {
                return
            }*/
            var back = ww[0] + '-' + ('0' + ww[1]).slice(-2) + '-' + ('0' + $(e.currentTarget).find('p').html()).slice(-2);
            this.el.hide();
            this.setDate(back)
        },
        getYear: function() {
            // var str = '';
            // var date = new Date().getFullYear();
            // console.log(date)
            // for (var i = 1900; i <= 2050; i++) {

            //     if (i == date) {
            //         str += '<option value="' + i + '"  selected = "selected" >' + i + '年</option>';
            //     } else {
            //         str += '<option value="' + i + '">' + i + '年</option>';
            //     }


            // }
            // this.el.find('.chooseYear .Year select').html(str);
        },
        getMonth: function() {
            // var str = '';
            // var date = new Date().getMonth() + 1;
            // console.log(date)
            // for (var i = 1; i <= 12; i++) {

            //     if (i == date) {
            //         str += '<option value="' + i + '" selected = "selected" >' + i + '月</option>';
            //     } else {
            //         str += '<option value="' + i + '">' + i + '月</option>';
            //     }
            // }
            // this.el.find('.chooseMonth .y_m select').html(str);
        }

    };

    // Return the module for AMD compliance.
    return DatePicker;
});
