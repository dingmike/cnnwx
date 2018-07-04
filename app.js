var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login')
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
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

    userInfo: {
      nickName: 'Hi,游客',
      userName: '点击去登录',
      avatarUrl: 'http://p9kyr79ne.bkt.clouddn.com/1/20180531/150547696d798c.png'
    },
    token: '',
    userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
    courseCouponCode: {},//购买课程的时候优惠券信息
  }
})