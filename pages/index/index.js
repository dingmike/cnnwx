const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const pay = require('../../services/pay');
//获取应用实例
const app = getApp();
Page({
    data: {
        style: 'width: 222rpx;background: #58b406;border-radius: 66rpx;color: #fff;',
        poem: "",
        current_poem_url: "",
        share: "",
        uid: "",
        avaData: false,
        userInfo: '',
        banner: [],
        joinBtn: "立即参与",
        learnType: '',
        learnType2: '',
        setTimeSty: true,
        payStatus: true,
        showModalStatus: false,
        cardM: function(a, t, e) {
            return t in a ? Object.defineProperty(a, t, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : a[t] = e, a;
        }({}, "reasonable", !1)
    },

    showToast() {
        let $toast = this.selectComponent(".J_toast");
        $toast && $toast.show()
    },
    onShareAppMessage: function () {
        return {
            desc: 'FecsTec English',
            title: this.data.share.share_title,
            imageUrl: this.data.share.share_img,
            path: "pages/index/index?uid=" + this.data.uid
        }
    },
    onLoad(t) {
        wx.showNavigationBarLoading();
        if (app.globalData.userInfo && app.globalData.userInfo != '') {
            this.setData({
                userInfo: app.globalData.userInfo,
            });
        } else {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.employIdCallback = info => {
                if (info != '') {
                    this.setData({
                       userInfo: info
                    });
                }
            }
        }
        this.getIndexData(1);
        this.getCnnIndexTypeTwo(0); //learnTypeId=0
        this.getLearnInfo();
        this._onLoad(); // 提前
    },
    _onLoad: function() {
        this.data.type = app.globalData.type;
        var e = app.globalData.openid;
        this.setData({
            openid: e,
            bgimg: app.globalData.bgimg
        });
    },
    takePartIn(e){
        wx.navigateTo({
            url: "/pages/gongDu/gongDu"
        });
    },
    takePartIn2(e){
        userInfo.startStatus
        if(userInfo.startStatus==1){
            wx.navigateTo({
                url: "/pages/dayReadList/dayReadList"
            });
        }else{

        }

    },
    getLearnInfo() {
        util.request(api.GetLearnInfo, {uid: wx.getStorageSync('openid'), learnTypeId:1}, 'POST').then( res =>{
            wx.hideNavigationBarLoading();
            if (res.errno === 0&&res.data) {
                wx.hideLoading();
                if(res.data.startStatus == 1){ // 已支付开始学习
                    this.setData({
                        avaData: true,
                        userInfo: res.data
                    })

                }else{ // 没支付
                    this.setData({
                        joinBtn: '马上加入学习',
                    });
                }

            }else{
                this.setData({
                    joinBtn: '立即参与',
                });
            }

        });
    },
    powerDrawer: function(a) {
        this.util(a);
    },
    powerDrawer2: function(a) {
        var t = a.currentTarget.dataset.statu;
        this.util(t);
    },
    util: function(a) {
        var t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = t, t.opacity(0).rotateX(-100).step(), this.setData({
            animationData: t.export()
        }), setTimeout(function() {
            t.opacity(1).rotateX(0).step(), this.setData({
                animationData: t
            }), "close" == a && this.setData({
                showModalStatus: !1
            });
        }.bind(this), 200), "open" == a && this.setData({
            showModalStatus: !0
        });
    },
    sendPay () {
        let t = wx.getStorageSync("openid"), e = this.data.type, o = this;
        /* wx.showLoading({
         title: "加载中"
         });*/
        util.request(api.GongduOrderSubmit, {uid: t, learnTypeId: 0}, 'POST').then(res => {
            if (res.errno === 0) {
                console.log("生成订单成功");
                o.data.orderSn= res.data.orderSn;
                pay.gongDuPayOrder(res.data.orderSn).then(ress => {

                    if("requestPayment:ok" == ress.errMsg){
                        wx.showToast({
                            title: "支付成功"
                        });
                        o.setData({
                            showModalStatus: false
                        });
                        o.updateSuccess();
                        // wx.hideLoading();
                    }

                    //o.updateSucces(); // 暂时用来查询微信支付成功
                }).catch(ress => {
                    console.log("支付失败或取消支付");
                    console.log(ress);
                    wx.hideLoading();
                    o.setData({
                        showModalStatus: false
                    });
                    // wx.hideLoading();
                });

            } else {
                util.showErrorToast('下单失败,请重试');
                // wx.hideLoading();
            }
        });
    },
    // 暂时使用查看是否支付成功
    updateSuccess() {
        util.request(api.OrderGongDuQuery, { orderId: this.data.orderSn}).then(res => {
            if(res.errno==0){
                wx.reLaunch({
                    url: "/pages/submitInfo/submitInfo"
                })
            }
        })
    },












    onShow: function() {
        /*var t = app.globalData.type;
        wx.setNavigationBarTitle({
            title: t + "练习"
        });*/
    },
    onReady: function () {
        // 页面渲染完成
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    getIndexData: function(learnTypeId) {
        let that = this;
        // learnTypeId  学习类型ID // 默认learnTypeId:1
        util.request(api.CnnIndexUrl, {learnTypeId: learnTypeId}).then(function (res) {
            if (res.errno === 0) {
                let e = res.data.userLearnList, o = res.data.userListTotal;

                if(o>200){
                    o = 200;
                    that.setData({
                        banner: res.data.banner,
                        learnType: e[0].learnType,
                        studyUser: e,
                        studyUserNums: o + "+"
                    })

                }else{
                    that.setData({
                        learnType: e[0].learnType,
                        banner: res.data.banner,
                        studyUser: e,
                        studyUserNums: o
                    });
                }
                wx.hideNavigationBarLoading();
            }
        });
    },
    getCnnIndexTypeTwo: function(learnTypeId) {
        let that = this;
        // learnTypeId  学习类型ID // 默认learnTypeId:1
        util.request(api.CnnIndexTypeTwo, {learnTypeId: learnTypeId}).then(function (res) {
            if (res.errno === 0) {
                let e = res.data.userLearnList, o = res.data.userListTotal;

                if(o>200){
                    o = 200;
                    that.setData({
                        learnType2: e[0].learnType,
                        studyUser2: e,
                        studyUserNums2: o + "+"
                    })

                }else{
                    that.setData({
                        learnType2: e[0].learnType,
                        studyUser2: e,
                        studyUserNums2: o
                    });
                }
                wx.hideNavigationBarLoading();
            }
        });
    },

   /* navigateTo: function(t) {
        wx.navigateTo(t);
    },*/
    select_poem: function(t) {
        this.setData({
            current_poem_url: t.currentTarget.dataset.url
        });
    },
/*    onShareAppMessage () {
        return{
            title: '英文能力',
            desc: '一起来学英语！',
            path: 'pages/index/index',
            imageUrl: this.data.imagePath,
            success(res){
                wx.showShareMenu({
                    withShareTicket: true
                })
            },
            fail(res){

            },
            complete(){

            }
        }
    }*/
});
