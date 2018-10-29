var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

var ePush = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./lib/push"))

App({
    onLaunch: function () {
        /* wx.getSetting({
         success: function(t) {
         debugger
         t.authSetting["scope.userInfo"] || wx.reLaunch({
         url: "/pages/firstAuth/firstAuth"
         });
         }
         });*/
        //获取用户的登录信息
        user.checkLogin().then(res => {
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
        });
    },

    globalData: {
        url: "",
        //new
        openid: "",
        learnTypeId1: 1,  // 21天阅读计划
        learnTypeId2: 2,// 每日阅读计划
        type: "21天英语学习达人养成计划",
        img: "/images/item/ly.png",
        bgimg: "/static/image/logos/123.jpg",
        coimg: "/images/coimg/ly.jpg",
        detailImg: [],
        ifFree: "1",
        days: 0,
        //new

        userInfo: '',
        /* userInfo: {
         nickName: 'Hi,游客',
         userName: '点击去登录',
         avatarUrl: 'http://p9kyr79ne.bkt.clouddn.com/1/20180531/150547696d798c.png'
         },*/
        token: '',
        userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
        courseCouponCode: {},//购买课程的时候优惠券信息
    },
    push: new ePush.default({
        appId: "",
        secretId: "4d311689884e04c38a83c07eeb711adb",
        templateId: "SdD4f6ZGVL71-BqQi8-a64htTEdFe3jwZBPufv2FsNQ",
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
    })
})