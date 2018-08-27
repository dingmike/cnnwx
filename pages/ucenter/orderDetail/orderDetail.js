var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay');
let e = getApp();
Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    express:[],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
          let reverseExpress = res.data.shippingList;
        if(res.data.shippingList){
            reverseExpress = reverseExpress.reverse();
        }
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption,
          express: reverseExpress
        });
          e.globalData.shipping_no = res.data.orderInfo.shipping_no;
          e.globalData.shipping_name = res.data.orderInfo.shipping_name;
          e.globalData._expressDetail = reverseExpress;
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder(){
    console.log('开始取消订单');
    let that = this;
    let orderInfo = that.data.orderInfo;
    console.log(orderInfo);

    var order_status = orderInfo.order_status;
    console.log(order_status);

    var errorMessage = '';
    switch (order_status){
      case 300: {
        console.log('已发货，不能取消');
        errorMessage = '订单已发货';
        break;
      }
      case 301:{
        console.log('已收货，不能取消');
        errorMessage = '订单已收货';
        break;
      }
      case 101:{
        console.log('已经取消');
        errorMessage = '订单已取消';
        break;
      }
      case 102: {
        console.log('已经删除');
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        console.log('已经退款');
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        console.log('已经退款退货');
        errorMessage = '订单已退货';
        break;
      }
    }
      
    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    
    console.log('可以取消订单的情况');
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          util.request(api.OrderCancel,{
            orderId: orderInfo.id
          }).then(function (res) {
            console.log(res.errno);
            if (res.errno === 0) {
              console.log(res.data);
              wx.showModal({
                title:'提示',
                content: res.data,
                showCancel:false,
                confirmText:'继续',
                success: function (res) {
                //  util.redirect('/pages/ucenter/order/order');
                  wx.navigateBack({
                    url: 'pages/ucenter/order/order',
                  });
                }
              });
            }
          });

        }
      }
    });
  },
  payOrder(e) {
      let that = this;
      let orderId = e.target.dataset.orderid;
      let repay = 1;// 再吃发起支付标志
      pay.payOrder(parseInt(orderId), repay).then(res => {
          wx.redirectTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
      }).catch(res => {
          wx.redirectTo({
              url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
      });


/*    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          }
        });
      }
    });*/

  },
    //确认收货
    confirmOrder(){
        let orderInfo = this.data.orderInfo;
        util.request(api.ConfirmOrder, {
            orderId: orderInfo.id
        }).then(res => {
          if(res.errno === 0){
              util.showSuccessToast(res.data);
          }
        })
    },
  gotoExpress(e) {
    debugger
        wx.navigateTo({
            url: "/pages/ucenter/express/express"
        });
    },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})