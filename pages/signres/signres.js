
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

let t = wx.createCanvasContext("myCanvas");
let e = getApp();
Page({
    data: {},
    onLoad: function(t) {
        var e = wx.getSystemInfoSync();
        console.log(e), console.log("结果页"), wx.showNavigationBarLoading();
        var a = this, n = .9 * e.windowWidth, o = .85 * e.windowHeight;
        console.log(n), console.log(o), a.setData({
            phoneWidth: n,
            phoneHeight: o
        });
        // a.getParameter();
        a.getCardNum();
    },
    extendRead: function() {
        wx.reLaunch({
            url: "../orale/orale-extend/orale-extend"
        });
    },
    getCardNum(){
        var openid = e.globalData.openid, a = e.globalData.type;
        util.request(api.GetCardNums, {uid: wx.getStorageSync('openid'), type: 1,}, 'POST').then( res =>{
            debugger
            this.canvas(res.data.length, a);
            wx.hideNavigationBarLoading();
        })
    },
    getParameter: function() {
        var t = e.globalData.openid, a = e.globalData.type, n = this;
        wx.request({
            url: e.globalData.url + "api/User/getCardNums",
            data: {
                uid: t,
                type: a
            },
            success: function(t) {
                n.canvas(t.data.length, a), wx.hideNavigationBarLoading();
            }
        });
    },
    canvas: function(a, n) {
        debugger
        var o = e.globalData.userInfo;
        console.log(o), console.log(e.globalData.coimg);
        e.globalData.single;
        var i = e.globalData.oraleCountent, s = this;
        if (t.setFillStyle("white"), t.fillRect(0, 0, this.data.phoneWidth, this.data.phoneHeight), 
        // t.drawImage(i.sceneimg, 0, 0, this.data.phoneWidth, .8 * this.data.phoneHeight),
        t.drawImage('/static/image/logos/1-3.jpg', 0, 0, this.data.phoneWidth, .8 * this.data.phoneHeight),
        t.drawImage("/static/image/icon/code.jpg", this.data.phoneWidth - 100, .7 * this.data.phoneHeight, 80, 80),
        wx.downloadFile({
            url: o.avatar,
            success: function(e) {
                200 === e.statusCode && (t.drawImage(e.tempFilePath, 10, .88 * s.data.phoneHeight, 50, 50), 
                t.draw());
            }
        }), t.setFontSize(12), t.setFillStyle("black"), t.setFontSize(12), t.fillText("已坚持学习" + n + a + "天", .2 * this.data.phoneWidth, .9 * this.data.phoneHeight), 
        i.keynums.length > 19) {
            t.setFontSize(12);
            var l = i.keynums.substr(0, 19), h = i.keynums.substr(19, i.keynums.length);
            t.fillText(l, .2 * this.data.phoneWidth, .95 * this.data.phoneHeight), t.fillText(h, .2 * this.data.phoneWidth, .95 * this.data.phoneHeight + 15);
        } else t.setFontSize(13), t.fillText(i.keynums, .2 * this.data.phoneWidth, .95 * this.data.phoneHeight);
    },
    shareImg: function() {
        wx.canvasToTempFilePath({
            fileType: "png",
            canvasId: "myCanvas",
            success: function(t) {
                console.log(t.tempFilePath);
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        console.log(t);
                        wx.showToast({
                            title: "已保存到相册"
                        });
                    }
                });
            }
        });
    },
    returnIndex: function() {
        console.log("回到首页");
        wx.reLaunch({
            url: "../index/index"
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