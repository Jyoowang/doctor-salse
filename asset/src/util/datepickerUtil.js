// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    var DatePicker = {};

    // Default View.
    DatePicker = {
        data: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        row: 0,
        model: null,
        mouth: null,
        year: null,
        nowChoose: null,
        /*
         * model
         * 1. monday ... sunday
         * 2. sunday monday ... sa
         */
        dataArray: [],
        initialize: function(opt) {
            this.model = opt.model
            this.nowChoose = opt.choose
            this.init(opt.data)
        },
        //data='2014-1'
        init: function(data) {
            var temp = data.split('-')
            temp[1] = Number(temp[1])
            temp[2] = Number(temp[2])
            if (Math.floor(temp[0] % 4) == 0) {
                this.data[1] = 29
            } else {
                this.data[1] = 28
            }
            this.dataArray = []

            var tempDatas = new Date(temp[0], (temp[1] - 1), 1) //当前月第一天
            //上个月
            var upDay=tempDatas.getDay()==0?7:tempDatas.getDay()
            var upMonth = this.data[(temp[1] - 2)]
            //下个月
            var nextDay=42-(upDay+this.data[(temp[1] - 1)])
            var nextMouth=this.data[(temp[1])]

            for(var i=0;i<upDay;i++){
                this.dataArray[i] = {}
                this.dataArray[i].day= upMonth-upDay+1+i
                this.dataArray[i].choose= false
            }

            for (var i = upDay; i < this.data[(temp[1] - 1)] + upDay; i++) {
                var tempData = new Date(temp[0], (temp[1] - 1), ((i-upDay) * 1 + 1))
                this.dataArray[i] = {}
                this.dataArray[i].choose = false
                if (this.nowChoose == temp[0] + "-" + ('0' + temp[1]).slice(-2) + '-' + ('0' + ((i-upDay) * 1 + 1)).slice(-2)) {
                    this.dataArray[i].choose = true
                }
  
                this.dataArray[i].day = tempData.getDate()
            }

            for(var i=1,s=42-nextDay; i<nextDay+1; i++,s++ ){
                this.dataArray[s] = {}
                this.dataArray[s].day= i
                this.dataArray[s].choose= false
            }

            this.upday = upDay
            this.nextday = nextDay
            this.mouth = temp[1]
            this.year = temp[0]
        },
        getDatePicker: function() {
            return {
                data: this.dataArray,
                upday: this.upday,
                nextday: this.nextday,
                mouth: this.mouth,
                year: this.year
            }
        }
    }

    // Return the module for AMD compliance.
    return DatePicker;
});
