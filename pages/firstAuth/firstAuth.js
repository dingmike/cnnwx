var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();

/*
Page({
    data: {
        userInfo: "",
        userData:'',
        ldata: true,
        showModal: false,
        showModalStatus: false
        // userInfo: {},
    },
    onReady: function () {

    },
    onLoad: function(e) {
        // 页面渲染完成
    },
    bindGetUserInfo(e) {
        debugger
        this.setData({
            userData: e.detail
        });
        if (e.detail.userInfo){
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.data.userInfo
                });
                app.globalData.userInfo = res.data.userInfo;
                // wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync("openid",res.data.userInfo.weixin_openid);
                wx.setStorageSync("token",res.data.token);
                app.globalData.openid = res.data.userInfo.weixin_openid;
                app.globalData.token = res.data.token;
                wx.navigateBack({ delta: 1 });
            }).catch((err) => {
                console.log(err)
            });
        } else {
            // this.setData({ldata: false});
            //用户按了拒绝按钮
            wx.showModal({
                title: '用户未授权',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success:  (res) => {
                    if (res.confirm) {
                    }else{
                    }
                }
            });
        }
    }
});*/





Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function () {
        var that = this;
        // 查看是否授权
        wx.getSetting({
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
        })
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
    queryUsreInfo: function () {
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
    },

})