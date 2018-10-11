var t = require("./../../utils/util"), e = require("./../../utils/share"), a = getApp();

Page({
    data: {
        showSlogan: !0,
        newsList: [],
        slogan: {},
        edata: "",
        userInfo: {},
        showbg: !1,
        canIUse: wx.canIUse("button.open-type.getUserInfo")
    },
    detailPage: function(t) {
        wx.navigateTo({
            url: "../detail/detail?pageId=" + t.currentTarget.dataset.value
        });
    },
    push: function(t) {
        a.push.add(t);
    },
    onLoad: function() {
        e.save(), wx.showShareMenu({
            withShareTicket: !0
        });
        var a = this;
        wx.request({
            url: t.host + "duenglish/list?t=chinaplus_cri_news",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    newsList: t.data
                });
            }
        }), wx.request({
            url: t.host + "motto_en",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    slogan: t.data
                });
            }
        });
    },
    getUserInfo: function(t) {
        try {
            wx.showLoading({
                title: "生成中"
            }), t.detail.userInfo ? (a.globalData.userInfo = t.detail.userInfo, this.setData({
                userInfo: t.detail.userInfo
            }), e.tosavePic(this)) : wx.hideLoading();
        } catch (t) {
            wx.hideLoading();
        }
    },
    cancelmove: function(t) {
        console.log(t);
    },
    savecanvaspic: function() {
        var t = this;
        wx.showLoading({
            title: "制作中"
        }), wx.canvasToTempFilePath({
            canvasId: "sharepage",
            success: function(e) {
                wx.hideLoading(), wx.showLoading({
                    title: "保存中"
                }), wx.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function(e) {
                        wx.hideLoading(), wx.showToast({
                            title: "已保存到相册",
                            icon: "success",
                            duration: 2e3
                        }), t.setData({
                            showbg: !1
                        });
                    }
                });
            }
        });
    },
    cancelcanvaspic: function() {
        this.setData({
            showbg: !1
        });
    }
});