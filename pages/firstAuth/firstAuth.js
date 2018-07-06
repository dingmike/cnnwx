var e = getApp();

Page({
    data: {
        userInfo: ""
    },
    onLoad: function(e) {},
    getuserauth: function() {
        var n = this;
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(t) {
                        n.setData({
                            userInfo: t.userInfo
                        }), e.globalData.userInfo = t.userInfo, wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    }
});