

const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
let e = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var e = new Date(), n = e.getFullYear(), r = e.getMonth() + 1, a = n + "-" + r;
        this.setData({
            date: a
        });
        this.setData({
            choiceYear: n,
            choiceMonth: r
        });
        // this.getCardRecord();
        this.getCardRecord2();
    },

    getCardRecord2(){
        let n = e.globalData.openid, r = this;
        util.request(api.GetCardRecord, {uid: wx.getStorageSync('openid'), type: 1,}, 'POST').then( res =>{
            debugger
            let nd = res.data;
            if(nd){
                for (var a = 0; a < nd.length; a++) nd[a].cardTime = util.translateTime("Y-m-d H:i:s", nd[a].cardTime);
                console.log(nd), r.setData({
                    cardData: nd
                }), r.processingData(nd);
            }else{
                this.setData({
                    showDatasNull: true
                })
            }

        })
    },
    getCardRecord() {
        let n = e.globalData.openid, r = this;
        wx.request({
            url: e.globalData.url + "api/User/getCardRecord",
            data: {
                uid: n
            },
            success: function(e) {
                var n = e.data;
                console.log(n), console.log("数据");
                for (var a = 0; a < n.length; a++) n[a].card_time = util.translateTime("Y-m-d H:i:s", n[a].card_time);
                console.log(n), r.setData({
                    cardData: n
                }), r.processingData(n);
            }
        });
    },
    bindDateChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value);
        var e = t.detail.value.substr(0, 4), n = t.detail.value.substr(5, 2);
        this.setData({
            date: t.detail.value,
            choiceYear: e,
            choiceMonth: n
        }); this.processingData();
    },
    processingData() {
debugger

        let r = new Object();
        if(this.data.cardData){
            for (var t = this.data.cardData, e = this.data.choiceYear, n = this.data.choiceMonth, a = 0, u = 0; u < t.length; u++)
                t[u].month == n && t[u].year == e && (r[a] = t[u], a++);

            0 == Object.keys(r).length ? (console.log("判空成立"), this.setData({
                showDatasNull: true
            })) : this.setData({
                showDatasNull: false
            }), this.setData({
                showData: r
            });
        }else{
            this.setData({
                showDatasNull: true
            })
        }

    },
    onReady: function() {},
    onShow: function() {},
    onShareAppMessage: function() {}
});