/*
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        // var that = this;
        // 查看是否授权
        /!*wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            //从数据库获取用户信息
                            that.queryUsreInfo();
                            //用户已经授权过
                            wx.switchTab({
                                url: ''
                            })
                        }
                    });
                }
            }
        })*!/
    },
    bindGetUserInfo: function (e) {
            if (e.detail.userInfo) {
                //用户按了允许授权按钮
                user.loginByWeixin(e.detail).then(res => {
                    this.setData({
                        userInfo: res.data.userInfo
                    });
                    app.globalData.userInfo = res.data.userInfo;
                    // wx.setStorageSync('userInfo', res.data.userInfo);
                    wx.setStorageSync("openid", res.data.userInfo.weixin_openid);
                    wx.setStorageSync("token", res.data.token);
                    app.globalData.openid = res.data.userInfo.weixin_openid;
                    app.globalData.token = res.data.token;
                    // wx.navigateBack({ delta: 1 });

                    wx.switchTab({
                        url: '/pages/index/index'
                    })

                }).catch((err) => {
                    console.log(err)
                });
            } else {
                // this.setData({ldata: false});
                //用户按了拒绝按钮
                wx.showModal({
                    title: '用户未授权',
                    content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                    confirmText: '返回授权',
                    success: (res) => {
                        if (res.confirm) {
                            console.log('用户点击了“返回授权”')
                        }
                    }
                });
            }
    },
    //获取用户信息接口
    /!*queryUsreInfo: function () {
        wx.request({
            url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
            data: {
                openid: getApp().globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                getApp().globalData.userInfo = res.data;
            }
        })
    },*!/

})*/


const util = require('../../utils/util.js');
const api = require('../../config/api.js');

//获取应用实例
const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navUrl: ''
    },

    onLoad: function (options) {
        let that = this;
        if (wx.getStorageSync("navUrl")) {
            that.setData(
                {
                    navUrl: wx.getStorageSync("navUrl")
                }
            )
        } else {
            that.setData(
                {
                    navUrl: '/pages/index/index'
                }
            )
        }
    },

    bindGetUserInfo: function (e) {
        let that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    util.request(api.AuthLoginByWeixin, {
                        code: res.code,
                        userInfo: e.detail
                    }, 'POST', 'application/json').then(res => {
                        if (res.errno === 0) {
                            //存储用户信息
                            wx.setStorageSync('userInfo', res.data.userInfo);
                            wx.setStorageSync('token', res.data.token);
                            wx.setStorageSync('userId', res.data.userId);
                            app.globalData.userInfo = res.data.userInfo;
                            // wx.setStorageSync('userInfo', res.data.userInfo);
                            wx.setStorageSync("openid", res.data.openId);
                            app.globalData.openid = res.data.openId;
                            app.globalData.token = res.data.token;

                        } else {
                            // util.showErrorToast(res.errmsg)
                            wx.showModal({
                                title: '提示',
                                content: res.errmsg,
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });

        if (that.data.navUrl && that.data.navUrl == '/pages/index/index') {
            wx.switchTab({
                url: that.data.navUrl,
            })
        } else if (that.data.navUrl) {
            wx.redirectTo({
                url: that.data.navUrl,
            })
        }
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})