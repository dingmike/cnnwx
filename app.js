// var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

var ePush = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./lib/push"))

App({
    onLaunch: function () {
        //-------------
        //获取小程序更新机制兼容
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法更好体验程序，请升级到最新微信版本后重试。'
            })
        }

        //-----------------




        /* wx.getSetting({
         success: function(t) {
         debugger
         t.authSetting["scope.userInfo"] || wx.reLaunch({
         url: "/pages/firstAuth/firstAuth"
         });
         }
         });*/
        //获取用户的登录信息
       /* user.checkLogin().then(res => {
            debugger
            this.globalData.userInfo = wx.getStorageSync('userInfo');
            this.globalData.token = wx.getStorageSync('token');
            //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.employIdCallback){
                this.employIdCallback(wx.getStorageSync('userInfo'));
            }

        }).catch(() => {
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('token');
        });*/
    },

    globalData: {
        url: "",
        //new
        openid: "",
        learnTypeId1: 1,  // 21天阅读计划
        learnTypeId2: 2,// 每日阅读计划
        type: "21天英语学习达人养成计划",
        img: "/images/item/ly.png",
        bgimg: "/static/image/logos/1-3.jpg",
        // bgimg: "http://bkcdn.fecstec.com/1/20181127/160558808fc56.jpg",
        coimg: "/images/coimg/ly.jpg",
        detailImg: [],
        ifFree: "1",
        days: 0,
        //new

        // userInfo: '',
         userInfo: {
         nickName: '游客你好',
         avatarUrl: 'http://bkcdn.fecstec.com/1/20181127/161640315dc4f1.png'
         },
        token: '',
        userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
        courseCouponCode: {},//购买课程的时候优惠券信息
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    push: new ePush.default({
        appId: "",
        secretId: "4d311689884e04c38a83c07eeb7",
        templateId: "SdD4f6ZGVL71-BqQi8-a64htTEdFe3jwZBPufv2Fs",
        page: "pages/index/index",
        data: {
            keyword1: {
                value: "英文能力"
            },
            keyword2: {
                value: "6:00-9:00"
            },
            keyword3: {
                value: "学习是自己得事"
            },
            keyword4: {
                value: "建议每日至少完成两篇英文文章的阅读"
            }
        }
    }),
    // 更新小程序
    updateManager: function () {
        //获取系统信息 客户端基础库
        wx.getSystemInfo({
            success: function (res) {
                //基础库版本比较，版本更新必须是1.9.90以上
                const v = util.compareVersion(res.SDKVersion, '1.9.90');
                if (v > 0) {
                    const manager = wx.getUpdateManager();
                    manager.onCheckForUpdate(function (res) {
                        // 请求完新版本信息的回调
                        //console.log(res.hasUpdate);
                    });
                    manager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    manager.applyUpdate();
                                }
                            }
                        })
                    });
                    manager.onUpdateFailed(function () {
                        // 新的版本下载失败
                        wx.showModal({
                              title: '提示',
                              content: '请删除小程序重新搜索英文能力获取！'
                            })
                    });
                } else {
                    // wx.showModal({
                    //   title: '温馨提示',
                    //   content: '当前微信版本过低，无法更好体验程序，请升级到最新微信版本后重试。'
                    // })
                }
            },
        })
    }
})