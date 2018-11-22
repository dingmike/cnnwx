var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
      intergrals: 0,// 总积分
      canUserIntergralsTotal: 0,// 该商品可以使用的总积分
      realUserIntergrals:0,
    isBuy: false,
    couponDesc: '',
    couponCode: '',
    buyType: '',
    deduction:0.1 // 默认抵扣率
  },
  onLoad: function (options) {

    console.log(options.isBuy);
    // 页面初始化 options为页面跳转所带来的参数
    if (options.isBuy!=null) {
      this.data.isBuy = options.isBuy
    }
    this.data.buyType = this.data.isBuy?'buy':'cart';
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON';
    app.globalData.courseCouponCode = {};
    this.getUserIntergrals();
    this.getDeduction();
  },
  getDeduction:function () {
      let that = this;
      util.request(api.Deduction).then(function (res) {
          console.log(res.data)
          that.setData({
              deduction: res.data
          })
      })
  },
  getCheckoutInfo: function () {
    let that = this;
    var url = api.CartCheckout;
    let buyType = this.data.isBuy ? 'buy' : 'cart';
    util.request(url, { addressId: that.data.addressId, couponId: that.data.couponId, type: buyType }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          addressId: res.data.checkedAddress.id,
          // checkedCoupon: res.data.checkedCoupon,
          // couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          canUserIntergralsTotal: Math.floor(res.data.orderTotalPrice*that.data.deduction) //默认可使用能力券为总价的10%後臺可設置 向下舍入
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
    onChangeNumber (e) {
        if(e.detail.number===this.data.canUserIntergralsTotal){
            wx.showModal({
                title: '',
                content: '该订单能力券最多使用 '+this.data.canUserIntergralsTotal+' 张！',
                showCancel: false,
                confirmText: '好的',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }

        let actualTotalPrice, canUserIntergrals;

        if(e.detail.type==='add'){
            actualTotalPrice = this.data.actualPrice-1;
            canUserIntergrals = this.data.intergrals-1;
        }else{
            actualTotalPrice = this.data.actualPrice+1;
            canUserIntergrals = this.data.intergrals+1;
        }

    this.setData({
        actualPrice: actualTotalPrice,
        intergrals: canUserIntergrals,
        realUserIntergrals: e.detail.number
    })

    },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.getCouponData();
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })

    try {
      let addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          addressId: addressId
        });
      }else{
          this.setData({
              addressId: 0
          });
      }
    } catch (e) {
      // Do something when catch error
      util.showErrorToast('系统错误，请联系管理员');
    }
      this.getCheckoutInfo();
  },

  /**
   * 获取优惠券
   */
  getCouponData: function () {
    if (app.globalData.userCoupon == 'USE_COUPON') {
      this.setData({
        couponDesc: app.globalData.courseCouponCode.name,
        couponId: app.globalData.courseCouponCode.user_coupon_id,
      })
    } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
      this.setData({
        couponDesc: "不使用优惠券",
        couponId: '',
      })
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  /**
   * 选择可用优惠券
   */
  tapCoupon: function () {
    let that = this;
      wx.navigateTo({
        url: '../selCoupon/selCoupon?buyType=' + that.data.buyType,
      })
  },
    getUserIntergrals(){
        util.request(api.UserIntergralInfo, { uid: wx.getStorageSync("openid") }, 'POST').then(res => {
            this.setData({
                intergrals: res.data.intergrals
            })
        })
    },
  submitOrder() {
      if (this.data.addressId === 0) {
          util.showErrorToast('请选择收货地址');
          return false;
      }
      wx.showLoading({
          title: 'Loading...',
      });
    util.request(api.OrderSubmit, { addressId: this.data.addressId, intergrals:this.data.realUserIntergrals, couponId: this.data.couponId, type: this.data.buyType }, 'POST').then(res => {
      wx.hideLoading();
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        wx.hideLoading();
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
                url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})