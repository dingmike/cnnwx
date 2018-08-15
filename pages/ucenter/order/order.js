var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay');

Page({
    data: {
        orderList: [],
        page: 1,
        size: 5,
        loadmoreText: '正在加载更多数据',
        nomoreText: '全部加载完成',
        nomore: false,
        totalPages: 1,
        refresh: false,
        orderStatus: '',
        realTotalPages: 1,
        listHeight:100
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        // 页面显示
        wx.showLoading({
            title: '加载中...',
            success: function () {

            }
        });

        this.getOrderList();
    },
    /*onPullDownRefresh(){
        debugger
        this.setData({
            page: 1,
            orderList: [],
            size: 5
        });
        // 增加下拉刷新数据的功能
        this.refresh = true;
        this.getOrderList();
    },*/
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom () {
        console.log("下一页");
        this.getOrderList();
    },
    scrollToLowerHandler() {
        debugger
        if(this.data.nomore){
            this.getOrderList();
        }
    },
    getOrderList(){
        let that = this;
        if (that.data.totalPages <= that.data.page - 1&&!that.data.refresh) {
            that.setData({
                nomore: true
            })
            return;
        }
        util.request(api.OrderList, {page: that.data.page, size: that.data.size, orderStatus: that.data.orderStatus}).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                if(res.data.totalPages==0){
                    that.setData({
                        // orderList: that.data.orderList.concat(res.data.data),
                        // page: res.data.currentPage + 1,
                        // totalPages: 1,
                        realTotalPages: res.data.totalPages

                    });
                }else{
                    that.setData({
                        orderList: that.data.orderList.concat(res.data.data),
                        page: res.data.currentPage + 1,
                        totalPages: res.data.totalPages,
                        realTotalPages: 1
                    });

                    let c = {
                        listHeight: wx.getSystemInfoSync().windowHeight - 45,
                        nomore: res.data.data.length < 5 ? true : false
                        // pageStatus: 0
                    };
                    if(res.data.data.length>0){
                        that.setData(c)
                    }
                }

                that.refresh = false;
                wx.hideLoading();
            }
        });
    },
    payOrder(e){
       /* wx.redirectTo({
            url: '/pages/pay/pay',
        })*/
        var orderId = e.target.dataset.orderid;
        // let that = this;

        pay.payOrder(parseInt(orderId)).then(res => {
            wx.redirectTo({
                url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
        }).catch(res => {
            wx.redirectTo({
                url: '/pages/payResult/payResult?status=0&orderId=' + orderId
            });
        });
        /*util.request(api.PayPrepayId, {
            orderId: orderId || 15
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
    updateSuccess() {
        let that = this;
        util.request(api.OrderQuery, { orderId: this.data.orderId}).then(function (res) {
        })
    },
    gotoOrderByStatus(orderStatus) {
        this.setData({
            page: 1,
            orderList: [],
            size: 5,
            orderStatus: orderStatus
        });
        wx.showLoading({
            title: '加载中...',
            success: function () {

            }
        });
        // 加载数据
        this.getOrderList();
    },
    gotoAllOrder() {
        this.gotoOrderByStatus("");
    },
    // 待付款
    gotoWaitPayOrder() {
        debugger
        this.gotoOrderByStatus(0);
    },
    // 待发货
    gotoSellerSendOrder() {
        this.gotoOrderByStatus(201);
    },
    // 待收货
    gotoBuyerConfirmGoodsOrder() {
        this.gotoOrderByStatus(300);
    },
    // 已完成
    gotoFinishOrder() {
        this.gotoOrderByStatus(402);
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})