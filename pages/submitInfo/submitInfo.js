var n = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
    data: {
        userInfo: {}
    },
    onLoad: function(n) {},
    formSubmit: function(o) {
        var e = n.globalData.userInfo;
        console.log(e);
        var a = new Object();
        o.detail.value.phone, o.detail.value.weixin, e.nickName;
        var t = wx.getStorageSync("openid");

        util.request(api.UserSubmitPhone, {uid: t,mobile:o.detail.value.phone, wechatId: o.detail.value.weixin}, 'POST').then(res => {

            if(res.errno == 0){
                wx.reLaunch({
                    url: "/pages/gongDu/gongDu"
                });
            }else{
                wx.showToast({
                    title: "绑定失败！",
                    icon: "none"
                });
            }
        })


        /*wx.request({
            url: n.globalData.url + "Formapi/addUserForm",
            data: {
                phone: a.phone,
                weixin: a.weixin,
                nickname: a.nickName,
                uid: n.globalData.openid
            },
            success: function(n) {
                console.log(n), n.data && wx.showToast({
                    title: "提交成功",
                    success: function() {
                        wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }
                });
            },
            fail: function() {
                wx.showToast({
                    title: "提交失败",
                    icon: "none"
                });
            }
        }), console.log(a);*/
    },
    onReady: function() {},
    onShow: function() {
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            n.globalData.userInfo = userInfo;
            n.globalData.token = token;
        }

        this.setData({
            userInfo: n.globalData.userInfo,
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});