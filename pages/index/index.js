const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp();
Page({
    data: {
        single: {
            unlocks: 10, //已经阅读打卡的天数
            setup: '08:30',  // 设置提醒时间
            starts: 1,  //是否已开始打卡
        },
        style: 'width: 222rpx;background: #ff9300;border-radius: 66rpx;color: #fff;',
        poem: "",
        current_poem_url: "",
        share: "",
        uid: "",
        userInfo: '',
        banner: [],
        joinBtn: "继续学习",
        learnType: '',
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
                debugger
                if (info != '') {
                    this.setData({
                       userInfo: info
                    });
                }
            }
        }




        debugger


       /* wx.showLoading({
            title: "加载中"
        });*/

        // 获取首页数据
      /*  var e = this, o = decodeURIComponent(t.scene);
        console.log(o);
        var s = this;

        wx.request({
            url: app.globalData.url + "api/Index/test",
            success: function(a) {
                console.log(a.data);
                e.setData({
                    test: a.data
                });
            }
        });*/
        this.getIndexData();
        this._onLoad(); // 提前
       /* wx.getUserInfo({
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

        var e = app.globalData.openid;
        console.log(e);
        this.setData({
            openid: e,
            bgimg: app.globalData.bgimg
        });
        // t.getStudyUser();
    },
    getStudyUser: function() {
        var t = this, e = this.data.type, o = app.globalData.openid;
        wx.request({
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
    takePartIn(e){
        wx.navigateTo({
            url: "/pages/gongDu/gongDu"
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
        // learnTypeId  学习类型ID
        util.request(api.CnnIndexUrl, {learnTypeId: 1}).then(function (res) {
            if (res.errno === 0) {

                let e = res.data.userLearnList, o = res.data.userListTotal;
                o > 200 ? (o = 200, that.setData({
                    banner: res.data.banner,
                    learnType: e[0].learnType,
                    studyUser: e,
                    studyUserNums: o + "+"
                })) : that.setData({
                    learnType: e[0].learnType,
                    banner: res.data.banner,
                    studyUser: e,
                    studyUserNums: o
                });
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
    }
})
