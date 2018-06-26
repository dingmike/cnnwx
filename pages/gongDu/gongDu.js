var a = getApp();

Page({
    data: {
        joinBtn: "继续学习",
        setTimeSty: !0,
        payStatus: !0,
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
    onLoad: function(t) {
        var e = this, o = decodeURIComponent(t.scene);
        console.log(o);
        var s = this;
        wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: a.globalData.url + "api/Index/test",
            success: function(a) {
                console.log(a.data), e.setData({
                    test: a.data
                });
            }
        }), wx.getUserInfo({
            success: function(t) {
                var e = t.userInfo;
                console.log(e.nickName), a.globalData.userInfo = e, s.setData({
                    choiceDataShow: !0,
                    userInfo: e
                });
                var o = wx.getStorageSync("openid");
                console.log(o.length), o.length < 20 ? (wx.showLoading({
                    title: "加载中"
                }), wx.login({
                    success: function(t) {
                        console.log(t.code), console.log("调用登录接口成功"), wx.request({
                            url: "https://riyubao.net/code3.php",
                            data: {
                                code: t.code
                            },
                            success: function(t) {
                                console.log(t), 200 == t.statusCode && wx.hideLoading(), wx.setStorageSync("openid", t.data.openid);
                                var e = wx.getStorageSync("openid");
                                a.globalData.openid = e, wx.hideNavigationBarLoading(), s.setData({
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
                }), a.globalData.openid = o, s._onLoad());
            }
        });
    },
    updateUserInfo: function() {
        var t = a.globalData.openid, e = a.globalData.userInfo.avatarUrl, o = a.globalData.userInfo.nickName;
        wx.request({
            url: a.globalData.url + "api/User/updateUserInfo",
            data: {
                uid: t,
                avatar: e,
                username: o
            },
            success: function(a) {
                console.log("更新结果"), console.log(a);
            }
        });
    },
    _onLoad: function() {
        var t = this;
        this.data.type = a.globalData.type, wx.showNavigationBarLoading();
        var e = a.globalData.openid;
        t.updateUserInfo(), console.log(e), this.setData({
            openid: e,
            bgimg: a.globalData.bgimg
        }), t.addUser(), t.getStudyUser(), t.getLastDay(), t.getConnaissances(), t.getCard(), 
        new Date().getHours() >= 10 && this.setData({
            joinBtn: "您已经错过规定打卡时间 点击学习"
        });
    },
    getCard: function() {
        var t = new Date(), e = this.data.openid, o = this, s = t.getMonth() + 1, n = t.getDate();
        console.log("月份" + s), console.log("日期" + n), wx.request({
            url: a.globalData.url + "api/user/getCard",
            data: {
                uid: e,
                mongth: s,
                day: n
            },
            success: function(a) {
                console.log("打卡结果"), console.log(a), o.setData({
                    cardM: a.data
                }), a.data && o.setData({
                    joinBtn: "今日已打卡 点击回顾"
                }), o.addUser();
            }
        });
    },
    getLastDay: function() {
        var t = this, e = this.data.openid;
        wx.request({
            url: a.globalData.url + "api/user/getLastDay",
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
            url: a.globalData.url + "api/orale/getConnaissances",
            success: function(a) {
                t.setData({
                    studyNums: a.data
                });
            }
        });
    },
    getStudyUser: function() {
        var t = this, e = this.data.type, o = a.globalData.openid;
        console.log(o), wx.request({
            url: a.globalData.url + "api/index/getNewStudyUser",
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
        var t = this, e = (t.data.cardM, a.globalData.userInfo);
        console.log(e);
        var o = t.data.openid, s = t.data.type;
        o && e && wx.request({
            url: a.globalData.url + "api/index/joinStudy",
            data: {
                uid: o,
                type: s,
                avatar: e.avatarUrl,
                username: e.nickName
            },
            success: function(e) {
                if (console.log("好的"), console.log(e), wx.hideLoading(), 21 == e.data.unlocks && t.setData({
                    contact: !0
                }), wx.hideNavigationBarLoading(), 0 == e.data.starts) t.setData({
                    joinBtn: "马上加入学习",
                    setTimeSty: !1
                }), e.data.unlocks = 0, a.globalData.single = e.data, t.setData({
                    single: e.data,
                    Contents: !0
                }); else {
                    a.globalData.single = e.data, t.setData({
                        single: e.data,
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
                console.log(a.globalData.iffree), 1 == a.globalData.iffree && 0 == e.data.starts && console.log("免费");
            }
        });
    },
    startStudy: function(t) {
        var e = this.data.single, o = (this.data.openid, this), s = this.data.type, n = t.currentTarget.dataset.days;
        a.globalData.days = n, e.starts || a.globalData.iffree ? wx.navigateTo({
            url: "../orale/orale?days=" + n + "&type=" + s
        }) : (console.log("用户还没开始付费学习"), o.powerDrawer(t.currentTarget.dataset.statu));
    },
    sendPay: function() {
        var t = this.data.openid, e = this.data.type, o = this;
        wx.showLoading({
            title: "加载中"
        }), wx.request({
            url: a.globalData.url + "api/Jporder/placeAnOrder/",
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
            url: a.globalData.url + "api/Pay/getPreOrder",
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
        a.globalData.type = o, a.globalData.days = e, this.data.test && e > this.data.single.unlocks ? console.log("超出用户解锁的天数") : wx.navigateTo({
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
        var e = this, o = this.data.openid, s = a.globalData.type;
        wx.request({
            url: a.globalData.url + "api/User/setRemindTime",
            data: {
                uid: o,
                type: s,
                setup: t.detail.value
            },
            success: function(a) {
                console.log(a), e.addUser();
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
        var t = a.globalData.type;
        wx.setNavigationBarTitle({
            title: t + "练习"
        });
    }
});