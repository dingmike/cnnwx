const util = require('../../utils/util.js');
const api = require('../../config/api.js');
// import Card from '../../palette/image-example';

let t = wx.createCanvasContext("myCanvas");
let e = getApp();
Page({
    // imagePath: '',
    data: {
        template: {},
        avatorUrl: '',
        imagePath: ''
    },
    onImgOK(e) {
        this.data.imagePath = e.detail.path;
        // console.log(e);
    },

    shareImg() {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.imagePath,
            success: function (t) {
                wx.showToast({
                    title: "已保存到相册"
                });
            }
        });
    },
    onLoad: function (t) {

        var eData = wx.getSystemInfoSync();
        wx.showNavigationBarLoading();
        // var a = this, n = .9 * e.windowWidth, o = .85 * e.windowHeight;
        var a = this, n = eData.windowWidth, o = .85 * eData.windowHeight;
        a.setData({
            phoneWidth: n,
            phoneHeight: o
        });
        wx.downloadFile({
            url: e.globalData.userInfo.avatar,
            success: function (res) {
                if (200 === res.statusCode) {
                    a.setData({
                        avatorUrl: res.tempFilePath
                    })
                    // a.data.avatorUrl = e.tempFilePath;
                    a.getCardNum();

                }
            }
        })

        /* wx.downloadFile({
         url: e.globalData.userInfo.avatar,
         success: function (res) {
         if (200 === res.statusCode) {
         a.setData({
         avatorUrl: res.tempFilePath
         })
         // a.data.avatorUrl = e.tempFilePath;
         debugger
         a.getCardNum();
         }
         }
         })*/
    },
    extendRead: function () {
        wx.reLaunch({
            url: "../orale/orale-extend/orale-extend"
        });
    },
    getCardNum(){
        var openid = e.globalData.openid, a = e.globalData.type;
        let aThis = this;
        util.request(api.GetCardNums, {uid: wx.getStorageSync('openid'), type: 1,}, 'POST').then(res => {
            wx.hideNavigationBarLoading();
            // this.canvas(res.data.length, a);
            var totalDay = res.data.length;
            aThis.setData({
                template: {
                    width: aThis.data.phoneWidth * 2 + 'rpx',
                    height: aThis.data.phoneHeight * 2 + 'rpx',
                    // background: '/static/image/logos/123.jpg',
                    background: e.globalData.bgimg,
                    views: [
                       /* {
                            type: 'image',
                            url: '/static/image/logos/123.jpg',
                            css: {
                                width: aThis.data.phoneWidth * 2 + 'rpx',
                                height: aThis.data.phoneHeight * 2 + 'rpx',
                                left: '0rpx',
                                bottom: '0rpx',
                            },
                        },*/
                        {
                            type: 'image',
                            url: '/static/image/icon/code.jpg',
                            css: {
                                borderWidth: '2rpx',
                                borderColor: '#000',
                                width: '240rpx',
                                height: '240rpx',
                                right: '64rpx',
                                bottom: '40rpx',
                            },
                        },
                        {
                            type: 'image',
                            // url: aThis.data.avatorUrl,
                            url: e.globalData.userInfo.avatar,
                            css: {
                                width: '100rpx',
                                height: '100rpx',
                                left: '20rpx',
                                top: .78 * aThis.data.phoneHeight * 2 + 'rpx',
                            },
                        },
                        //"已坚持学习" + n + (a+1) + "天", .2 * this.data.phoneWidth, .9 * this.data.phoneHeight
                        {
                            type: 'text',
                            text: "我已坚持" + a +'并且成功打卡'+ (totalDay + 1) + "天啦！",
                            css: [{
                                left: '140rpx',
                                width: '280rpx',
                                top: .78 * aThis.data.phoneHeight * 2 + 'rpx',
                                color: '#fff',
                                fontSize: '24rpx',
                                lineHeight: '30rpx'
                            }]
                        }
                    ],
                }
            });

        })
    },
    shareImgOld: function () {
        wx.canvasToTempFilePath({
            fileType: "png",
            canvasId: "myCanvas",
            success: function (t) {
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function (t) {
                        wx.showToast({
                            title: "已保存到相册"
                        });
                    }
                });
            }
        });
    },
    returnIndex: function () {
        wx.reLaunch({
            url: "../index/index"
        });
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
    },
    onShareAppMessage: function () {
        var self = this;
        return{
            title: '英文能力',
            desc: '一起来学英语！',
            path: 'pages/index/index',
            imageUrl: self.data.imagePath,
            success(res){
              wx.showShareMenu({
                  withShareTicket: true
              })
            },
            fail(res){

            },
            complete(){

            }
        }
    }
});
