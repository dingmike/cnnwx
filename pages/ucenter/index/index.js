var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: {},
        hasMobile: '',
        intergrals: 'loading...'
    },
    onLoad: function (options) {
        //util.redirect("pages/ucenter/index/index");

        // 页面初始化 options为页面跳转所带来的参数
        console.log(app.globalData)

    },
    onReady: function () {

    },
    onShow: function () {
        let that=this;
        user.checkLogin().then(res => {
            //已经登录
            if(res){
                that.userIntergralInfo();
                return
            }
        }).catch((err) => {
            // 未登录
            wx.navigateTo({
                url: "/pages/firstAuth/firstAuth"
                // url: "/pages/rank/rank"
            })
        });
        wx.setNavigationBarTitle({
            title: "我的"
        });
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }

        that.setData({
            userInfo: app.globalData.userInfo,
        });

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    userIntergralInfo(){
        util.request(api.UserIntergralInfo, {uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            if(res.errno===0){
                this.setData({
                    intergrals:res.data.intergrals
                })
            }

        })
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})