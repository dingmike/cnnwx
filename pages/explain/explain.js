const app = getApp();
Page({
    data: {},
    onLoad: function(n) {
        wx.showLoading({
            title: "加载中"
        });
        this.setData({
            detailImgList: app.globalData.detailImg
        });
    },
    imgLoad: function(n) {
        wx.hideLoading();
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