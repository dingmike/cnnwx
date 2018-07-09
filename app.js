var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

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
            console.log('app login')
            debugger
            this.globalData.userInfo = wx.getStorageSync('userInfo');
            this.globalData.token = wx.getStorageSync('token');

            //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.employIdCallback){
                this.employIdCallback(wx.getStorageSync('userInfo'));
            }

        }).catch(() => {

        });
    },

    globalData: {
        url: "https://riyubao.net/oralproject/public/index.php/",
        //new
        openid: "",
        type: "21天口语达人养成计划",
        img: "/images/item/ly.png",
        bgimg: "https://riyubao.net/oralproject/public/datas/item/b2.jpg",
        coimg: "/images/coimg/ly.jpg",
        detailImg: "https://riyubao.net/oralproject/public/datas/item/lyDetail2.jpg",
        ifFree: "1",
        days: 0,
        //new

        userInfo: '',
      /*  userInfo: {
            nickName: 'Hi,游客',
            userName: '点击去登录',
            avatarUrl: 'http://p9kyr79ne.bkt.clouddn.com/1/20180531/150547696d798c.png'
        },*/
        token: '',
        userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
        courseCouponCode: {},//购买课程的时候优惠券信息
    }
})