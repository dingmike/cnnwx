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
        flags: false
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
        if(this.data.listStatus !=3&&this.data.flags){
            this.getOrderList(true)
        }
    },
    getOrderList(flag){
        // let that = this;
        this.setData({
            listStatus: 2,
            flags: false
        })
        util.request(api.OrderList, {page: this.data.page, size: this.data.size, orderStatus: this.data.orderStatus}).then( res=> {
            if (res.errno === 0) {
                console.log(res.data);
                if(res.data.totalPages==0){
                    this.setData({
                        page: res.data.currentPage + 1,
                        realTotalPages: res.data.totalPages,
                        listHeight: wx.getSystemInfoSync().windowHeight -40 ,
                        listStatus: 3,
                        pageStatus: 0
                    });

                }else{
                    this.setData({
                            orderList: this.data.orderList.concat(res.data.data),
                            page: res.data.currentPage + 1,
                            totalPages: res.data.totalPages,
                            realTotalPages: 1,
                            listHeight: wx.getSystemInfoSync().windowHeight -40 ,
                            listStatus: res.data.data.length < 5 ? 3 : 1,
                            pageStatus: 0,
                            flags: true
                        });
                }
            }else{
                if(flag){
                    this.setData({
                        listStatus: 1,
                        pageStatus: 2
                    });
                }
            }
        });
    },
    payOrder(e){
        let orderId = e.target.dataset.orderid;
        let repay = 1;// 再吃发起支付标志
        // let that = this;
        pay.payOrder(parseInt(orderId), repay).then(res => {
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
    // 全部
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
    // 暂时用户确认收货就订单已完成 301  如果有退货的就402
    gotoFinishOrder() {
        this.gotoOrderByStatus(301);
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