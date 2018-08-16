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
        listHeight: 0,
        pageStatus: 1,
        listStatus: 1,
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        // 页面显示
        this.getOrderList();
    },
   // 出错重新加载按钮事件
    reloadHandler() {
        this.setData({
            pageStatus: 1
        });
        this.getOrderList(true);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
   /* onReachBottom () {
        console.log("下一页");
        this.getOrderList();
    },*/
    scrollToLowerHandler() {
        3 != this.data.listStatus &&  this.getOrderList(true);
    },
    getOrderList(flag){
        let that = this;
        that.setData({
            listStatus: 2
        })
        util.request(api.OrderList, {page: that.data.page, size: that.data.size, orderStatus: that.data.orderStatus}).then(function (res) {
            if (res.errno === 0) {
                console.log(res.data);
                if(res.data.totalPages==0){
                    that.setData({
                        realTotalPages: res.data.totalPages,
                        listHeight: wx.getSystemInfoSync().windowHeight -40 ,
                        listStatus: res.data.data.length < 5 ? 3 : 1,
                        pageStatus: 0
                    });

                }else{
                        that.setData({
                            orderList: that.data.orderList.concat(res.data.data),
                            page: res.data.currentPage + 1,
                            totalPages: res.data.totalPages,
                            realTotalPages: 1,
                            listHeight: wx.getSystemInfoSync().windowHeight -40 ,
                            listStatus: res.data.data.length < 5 ? 3 : 1,
                            pageStatus: 0
                        });
                }
            }else{
                if(flag){
                    that.setData({
                        listStatus: 1,
                        pageStatus: 2
                    });
                }
            }
        });
    },
    payOrder(e){
        let orderId = e.target.dataset.orderid;
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

    },
    updateSuccess() {
        let that = this;
        util.request(api.OrderQuery, { orderId: this.data.orderId}).then(function (res) {
        })
    },
    gotoOrderByStatus(orderStatus) {
        this.setData({
            page: 1,
            pageStatus: 1,
            orderList: [],
            size: 5,
            orderStatus: orderStatus
        });
        this.getOrderList(true);
    },
    gotoAllOrder() {
        this.gotoOrderByStatus("");
    },
    // 待付款
    gotoWaitPayOrder() {
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