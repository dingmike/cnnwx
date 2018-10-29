const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const pay = require('../../services/pay');
//获取应用实例
const app = getApp();
Page({
    data: {
        single: {
            unlocks: 0, //已经阅读打卡的天数
            setupTime: '07:30',  // 设置提醒时间
            startStatus: 0,  //是否已开始打卡
            miss:0,
        },
        test:true,
        poem: "",
        current_poem_url: "",
        share: "",
        uid: "",
        avaData: false,
        banner: [],
        joinBtn: "继续学习",
        setTimeSty: true,
        payStatus: true,
        showModalStatus: false,
        learnTypeId: 1,
        orderSn: '',
        cardM: function(a, t, e) {
            return t in a ? Object.defineProperty(a, t, {
                value: e,
                enumerable: true,
                configurable: true,
                writable: true
            }) : a[t] = e, a;
        }({}, "reasonable", false)
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

    onLoad() {
        // 判断是否登录
      /*  user.checkLogin().then(res => {
            //已经登录
            return
        }).catch((err) => {
            // 未登录
            wx.navigateTo({
                url: "/pages/firstAuth/firstAuth"
            })
        });*/
        wx.showNavigationBarLoading();
        // 获取个人信息
        this.getLearnInfo();
        // 获取首页数据
        this.getIndexData();
        this.data.type = app.globalData.type;

        var e = app.globalData.openid;
        this.setData({
            openid: e
        });

        this.getLastDay();
        // this.getOneCard();
        if(new Date().getHours() >= 10 ){
            this.setData({
                joinBtn: "您已经错过规定打卡时间 点击学习"
            });
        }

    },

    getOneCard(unlocks){

        var t = new Date(), e = this.data.openid, s = t.getMonth() + 1, n = t.getDate(), y = t.getFullYear();
        // type learn type id 判断今日是否打过卡
        util.request(api.GetOneCard, {uid: wx.getStorageSync('openid'), type: 1, day: n, month: s, year: y}, 'POST').then( res =>{

                if(res.data){
                    this.setData({
                        cardM: res.data
                    });
                    this.setData({
                        joinBtn: "今日已打卡 点击回顾"
                    });
                    if(unlocks==16){
                        this.setData({
                            contact: true
                        });
                    }
                }
        })
    },
    getLearnInfo() {
        util.request(api.GetLearnInfo, {uid: wx.getStorageSync('openid'), learnTypeId:1}, 'POST').then( res =>{
            wx.hideNavigationBarLoading();
            if (res.errno === 0&&res.data) {
                wx.hideLoading();
                let studyNums = [];
                for(let i=1; i<=res.data.genusdays; i++){
                    studyNums.push({genusdays: i})
                }
                this.setData({
                    studyNums: studyNums
                });

                app.globalData.single = res.data;
                this.setData({
                    single: res.data,
                    Contents: true
                });

                if(res.data.startStatus == 1){ // 已支付开始学习
                    this.setData({
                        avaData: true,
                        userInfo: res.data
                    })

                }else{ // 没支付
                    this.setData({
                        contact: false,
                        joinBtn: '马上加入学习',
                        setTimeSty: false
                    });

                }

                if(16 == res.data.unlocks){
                    this.getOneCard(res.data.unlocks);

                }else{
                    this.getOneCard();
                }

            }else{
                let mockData = {
                    "id": "",
                    "learnTypeId": 0,
                    "userid": 0,
                    "unlocks": 0,
                    "formId": "",
                    "miss": 0,
                    "startStatus": 0,
                    "setupTime": "",
                    "addTime": "",
                    "updateTime": "",
                    "userName": "",
                    "avatar": "",
                    "nickname": "",
                    "learnType": "",
                    "genusdays": 21
                };
                let studyNums = [];
                for(let i=1; i<=mockData.genusdays; i++){
                    studyNums.push({genusdays: i})
                }
                this.setData({
                    studyNums: studyNums,
                    contact: false,
                    joinBtn: '马上加入学习',
                    setTimeSty: false,
                    single: mockData,
                    Contents: !0
                });
            }

        });
    },
    getLastDay(){
        let t = this, e = this.data.openid;
    },
    startStudy: function(t) {
        let e = this.data.single, o = (this.data.openid, this), s = this.data.type,
            n = t.currentTarget.dataset.days;// 打卡unlock day 该打第几天的卡n
        app.globalData.days = n;

        if(e.startStatus || app.globalData.iffree ){
            // 导航到第n天的学习内容
            wx.navigateTo({
                url: "../orale/orale?days=" + n + "&type=" + s
            })
        }else{
            console.log("用户还没开始付费学习");
            o.powerDrawer(t.currentTarget.dataset.statu);
        }
    },
    sendPay () {
        let t = wx.getStorageSync("openid"), e = this.data.type, o = this;
       /* wx.showLoading({
            title: "加载中"
        });*/
        util.request(api.GongduOrderSubmit, {uid: t, learnTypeId: o.data.learnTypeId}, 'POST').then(res => {
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
    reviewHistory: function(t) {
        let e = t.currentTarget.dataset.day, o = this.data.type;
        app.globalData.type = o;
        app.globalData.days = e;

        if(this.data.test&& e > this.data.single.unlocks){
            console.log('超出用户解锁的天数')
        }else{
            wx.navigateTo({
                url: "../orale/orale?days=" + e + "&type=" + o
            });
        }

       /* this.data.test && e > this.data.single.unlocks ? console.log("超出用户解锁的天数") : wx.navigateTo({
            url: "../orale/orale?days=" + e + "&type=" + o
        });*/
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
    bindTimeChange (t){
        console.log(t.detail.value);
        var e = this, o = this.data.openid, s = app.globalData.type;
        util.request(api.SetRemindTime, {type: 1, setupTime: t.detail.value, uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            if(res.data){
                this.getLearnInfo();
            }
        })
    },
    bindExplain: function() {
        wx.navigateTo({
            url: "../explain/explain"
        });
    },
    tiaozhuan: function() {
        wx.navigateTo({
            url: "../signres/signres"
        });
    },
    onShow: function() {



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
    // 获取信息
    getIndexData: function() {
        let that = this;
        util.request(api.CnnIndexUrl).then(res =>{
            if (res.errno === 0) {
                /*that.setData({
                    banner: res.data.banner,
                    learnTypeId: res.data.userLearnList[0].learnTypeId
                });*/
                    // 计划详情图文
                app.globalData.detailImg = res.data.learnFilePics;
                let e = res.data.userLearnList, o = res.data.userListTotal;
                o > 200 ? (o = 200, that.setData({
                    banner: res.data.banner,
                    learnType: e[0].learnType,
                    studyUser: e,
                    learnTypeId: res.data.userLearnList[0].learnTypeId,
                    studyUserNums: o + "+"
                })) : that.setData({
                    learnType: e[0].learnType,
                    banner: res.data.banner,
                    studyUser: e,
                    learnTypeId: res.data.userLearnList[0].learnTypeId,
                    studyUserNums: o
                });
            }
        });
    },
    navigateTo: function(t) {
        wx.navigateTo(t);
    },
    select_poem: function(t) {
        this.setData({
            current_poem_url: t.currentTarget.dataset.url
        });
    },
    formSubmit(){
        // 提交formID
    }
});
