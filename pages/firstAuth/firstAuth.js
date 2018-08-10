
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: ""
        // userInfo: {},
    },
    onReady: function () {

    },
    onLoad: function(e) {
        debugger
        // 页面渲染完成
       /* if(app.globalData.userInfo){
            wx.redirectTo({
                url: "/pages/gongDu/gongDu"
            });
        }*/
    },
    /*getuserauth: function() {
        var n = this;
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(t) {
                        n.setData({
                            userInfo: t.userInfo
                        }), app.globalData.userInfo = t.userInfo, wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },*/
    bindGetUserInfo(e) {
        if (e.detail.userInfo){
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.data.userInfo
                });
                app.globalData.userInfo = res.data.userInfo;
                wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync("openid",res.data.userInfo.weixin_openid);
                app.globalData.openid = res.data.userInfo.weixin_openid;
                app.globalData.token = res.data.token;
                setTimeout(function(){
                    /*wx.redirectTo({
                        url: "/pages/gongDu/gongDu"
                    });*/
                    wx.navigateBack({ changed: true });
                },1500)

            }).catch((err) => {
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    user.loginByWeixin(e.detail).then(res => {
                                        this.setData({
                                            userInfo: res.data.userInfo
                                        });
                                        app.globalData.userInfo = res.data.userInfo;
                                        wx.setStorageSync('userInfo', res.data.userInfo);
                                        app.globalData.token = res.data.token;
                                        /*wx.redirectTo({
                                            url: "/pages/gongDu/gongDu"
                                        });*/
                                        wx.navigateBack({ changed: true });
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }
    },
});