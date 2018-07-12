const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        single: {
            unlocks: 10, //已经阅读打卡的天数
            setup: '08:30',  // 设置提醒时间
            starts: 1,  //是否已开始打卡
        },
        poem: "",
        current_poem_url: "",
        share: "",
        uid: "",
        banner: [],
        joinBtn: "继续学习",
        setTimeSty: true,
        payStatus: true,
        showModalStatus: !1,
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
        let $toast = this.selectComponent(".J_toast")
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

    onLoad: function(t) {
        debugger
        /* wx.showLoading({
         title: "加载中"
         });*/

        // 获取首页数据
        this.getIndexData();


        var e = this, o = decodeURIComponent(t.scene);
        console.log(o);
        var s = this;

       /* wx.request({
            url: app.globalData.url + "api/Index/test",
            success: function(a) {
                console.log(a.data);
                e.setData({
                    test: a.data
                });
            }
        });*/
        s._onLoad(); // 提前
      /*  wx.getUserInfo({
            success: function(t) {
                debugger
                var e = t.userInfo;
                console.log(e.nickName);
                app.globalData.userInfo = e;
                s.setData({
                    choiceDataShow: !0,
                    userInfo: e
                });
                var o = wx.getStorageSync("openid");
                console.log(o.length);
                o.length < 20 ? (wx.showLoading({
                    title: "加载中"
                }),wx.login({
                    success: function(t) {
                        console.log(t.code);
                        console.log("调用登录接口成功");


                        wx.request({
                            url: "https://riyubao.net/code3.php",
                            data: {
                                code: t.code
                            },
                            success: function(t) {
                                console.log(t), 200 == t.statusCode && wx.hideLoading(), wx.setStorageSync("openid", t.data.openid);
                                var e = wx.getStorageSync("openid");
                                app.globalData.openid = e, wx.hideNavigationBarLoading(), s.setData({
                                    openid: e
                                }), s._onLoad();
                            }
                        });
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                })) : (wx.hideLoading(), s.setData({
                    openid: o
                }), app.globalData.openid = o, s._onLoad());
            }
        });*/
    },
    _onLoad: function() {
        debugger
        var t = this;
        this.data.type = app.globalData.type;
        wx.showNavigationBarLoading();
        var e = app.globalData.openid;
        console.log(e);
        this.setData({
            openid: e,
            bgimg: app.globalData.bgimg
        });
        t.getLearnInfo();
        t.addUser();
        t.getStudyUser();
        t.getLastDay();
        t.getConnaissances();
        t.getCard();
        new Date().getHours() >= 10 && this.setData({
            joinBtn: "您已经错过规定打卡时间 点击学习"
        });
    },
    getCard: function() {
        var t = new Date(), e = this.data.openid, o = this, s = t.getMonth() + 1, n = t.getDate();
        console.log("月份" + s);
        console.log("日期" + n);
        wx.request({
            url: app.globalData.url + "api/user/getCard",
            data: {
                uid: e,
                mongth: s,
                day: n
            },
            success: function(a) {
                console.log("打卡结果");
                console.log(a);
                o.setData({
                    cardM: a.data
                }), a.data && o.setData({
                    joinBtn: "今日已打卡 点击回顾"
                }), o.addUser();
            }
        });
    },

    getLearnInfo() {

        util.request(api.GetLearnInfo, {uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            debugger
            if (res.errno === 0) {

                wx.hideLoading();

                if(res.data.start_status == 1){ // 已支付开始学习



                }else{
                    wx.hideNavigationBarLoading();
                    this.setData({
                        contact: false,
                        joinBtn: '马上加入学习',
                        setTimeSty: false
                    });

                    // app.globalData.single = res.data
                }




                if (21 == res.data.unlocks && this.setData({
                        contact: !0
                    }), wx.hideNavigationBarLoading(), 0 == res.data.starts) this.setData({
                    joinBtn: "马上加入学习",
                    setTimeSty: !1
                }), res.data.unlocks = 0, app.globalData.single = res.data, this.setData({
                    single: res.data,
                    Contents: !0
                }); else {
                    app.globalData.single = res.data, this.setData({
                        // single: e.data,
                        single: {},
                        Contents: !0
                    });
                    var o = wx.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 1e3,
                        timingFunction: "ease",
                        delay: 0
                    });
                    o.translate(-95).step(), this.setData({
                        animationData: o.export(),
                        avaData: !0
                    });
                }

            }
        });
    },
    getLastDay: function() {
        var t = this, e = this.data.openid;
        wx.request({
            url: app.globalData.url + "api/user/getLastDay",
            data: {
                uid: e
            },
            success: function(a) {
                a.data && t.addUser();
            }
        });
    },
    getConnaissances: function() {
        var t = this;
        wx.request({
            url: app.globalData.url + "api/orale/getConnaissances",
            success: function(a) {
                t.setData({
                    studyNums: a.data
                });
            }
        });
    },
    getStudyUser: function() {
        debugger
        var t = this, e = this.data.type, o = app.globalData.openid;
        console.log(o), wx.request({
            url: app.globalData.url + "api/index/getNewStudyUser",
            data: {
                type: e,
                openid: o
            },
            success: function(a) {
                var e = a.data.data, o = a.data.status;
                o > 200 ? (o = 200, t.setData({
                    studyUser: e,
                    studyUserNums: o + "+"
                })) : t.setData({
                    studyUser: e,
                    studyUserNums: o
                });
            }
        });
    },
    addUser: function() {
        wx.showNavigationBarLoading();




      /*  var t = this, e = (t.data.cardM, app.globalData.userInfo);
        console.log(e);
        var o = t.data.openid, s = t.data.type;
        o && e && wx.request({
            url: app.globalData.url + "api/index/joinStudy",
            data: {
                uid: o,
                type: s,
                avatar: e.avatarUrl,
                username: e.nickName
            },
            success: function(e) {
                console.log("好的");
                console.log(e);
                wx.hideLoading();
                if (21 == e.data.unlocks && t.setData({
                        contact: !0
                    }), wx.hideNavigationBarLoading(), 0 == e.data.starts) t.setData({
                    joinBtn: "马上加入学习",
                    setTimeSty: !1
                }), e.data.unlocks = 0, app.globalData.single = e.data, t.setData({
                    single: e.data,
                    Contents: !0
                }); else {
                    app.globalData.single = e.data, t.setData({
                        // single: e.data,
                        single: {},
                        Contents: !0
                    });
                    var o = wx.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 1e3,
                        timingFunction: "ease",
                        delay: 0
                    });
                    o.translate(-95).step(), t.setData({
                        animationData: o.export(),
                        avaData: !0
                    });
                }
                console.log(app.globalData.iffree), 1 == app.globalData.iffree && 0 == e.data.starts && console.log("免费");
            }
        });*/
    },
    startStudy: function(t) {
        var e = this.data.single, o = (this.data.openid, this), s = this.data.type, n = t.currentTarget.dataset.days;
        app.globalData.days = n, e.starts || app.globalData.iffree ? wx.navigateTo({
            url: "../orale/orale?days=" + n + "&type=" + s
        }) : (console.log("用户还没开始付费学习"), o.powerDrawer(t.currentTarget.dataset.statu));
    },
    sendPay: function() {
        var t = this.data.openid, e = this.data.type, o = this;
        wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: app.globalData.url + "api/Jporder/placeAnOrder/",
            data: {
                uid: t,
                goodsinfo: "21口语练习计划" + e,
                type: e
            },
            success: function(a) {
                console.log(a.data), console.log("数据库生成订单成功"), a.data ? o.Pay(a.data) : wx.showToast({
                    title: "失败，请重试"
                });
            }
        });
    },
    Pay: function(t) {
        console.log("准备向服务器发送支付请求");
        var e = this, o = this.data.openid, s = this.data.type;
        wx.request({
            url: app.globalData.url + "api/Pay/getPreOrder",
            data: {
                uid: o,
                id: t,
                type: s
            },
            success: function(a) {
                console.log(a), wx.requestPayment({
                    timeStamp: a.data.timeStamp,
                    nonceStr: a.data.nonceStr,
                    package: a.data.package,
                    signType: a.data.signType,
                    paySign: a.data.paySign,
                    success: function(a) {
                        console.log("支付成功"), "requestPayment:ok" == a.errMsg && wx.showToast({
                            title: "支付成功"
                        }), e.setData({
                            showModalStatus: !1
                        }), wx.reLaunch({
                            url: "/pages/submitInfo/submitInfo?uid=" + o + "&type=" + s
                        });
                    },
                    fail: function(a) {
                        console.log("支付失败或取消支付"), console.log(a), wx.hideLoading(), e.setData({
                            showModalStatus: !1
                        });
                    },
                    complete: function(a) {
                        wx.hideLoading();
                    }
                });
            }
        });
    },
    setUserStatus: function() {
        return !0;
    },
    reviewHistory: function(t) {
        var e = t.currentTarget.dataset.day, o = this.data.type;
        app.globalData.type = o, app.globalData.days = e, this.data.test && e > this.data.single.unlocks ? console.log("超出用户解锁的天数") : wx.navigateTo({
            url: "../orale/orale?days=" + e + "&type=" + o
        });
    },
    powerDrawer: function(a) {
        console.log(a), this.util(a);
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
    bindTimeChange: function(t) {
        console.log(t);
        var e = this, o = this.data.openid, s = app.globalData.type;
        wx.request({
            url: app.globalData.url + "api/User/setRemindTime",
            data: {
                uid: o,
                type: s,
                setup: t.detail.value  // 设置新的提醒时间
            },
            success: function(a) {
                console.log(a);
                e.addUser();
            }
        });
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
        var t = app.globalData.type;
        wx.setNavigationBarTitle({
            title: t + "练习"
        });
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
    getIndexData: function() {

        let that = this;
        util.request(api.CnnIndexUrl).then(function (res) {
            debugger
            if (res.errno === 0) {
                that.setData({
                    banner: res.data.banner
                });
            }
        });

        /*app.request_post(i, n, function(t) {
         if (e.data.uid.length > 0) {
         var i = "https://fudai.i-meihao.shop/index.php?m=Mini&c=Poetry&a=help&uid=" + e.data.uid;
         app.request_post(i, {}, {}, 1);
         }
         e.setData({
         poem: t.data.list,
         share: t.data.share,
         uid: t.data.uid
         });
         }, 0);*/
    },
    navigateTo: function(t) {
        wx.navigateTo(t);
    },
    select_poem: function(t) {
        this.setData({
            current_poem_url: t.currentTarget.dataset.url
        });
    }
})
