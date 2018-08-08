let n = getApp();

Page({
    data: {
        express:[],
        shipping_name:'',
        shipping_no: ''
    },
    onLoad: function(a) {
        let o = n.globalData._expressDetail;
        this.setData({
            express: o,
            shipping_name: n.globalData.shipping_name,
            shipping_no: n.globalData.shipping_no
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});