Page({
    data: {},
    onLoad: function(n) {
        wx.showLoading({
            title: "加载中"
        });
    },
    imgLoad: function(n) {
        console.log(n), wx.hideLoading();
    },
    continueStudy: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});