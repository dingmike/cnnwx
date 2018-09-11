var n = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
    data: {
        userInfo: {},
        mobile:'',
        wechatId:'',
        formIdArray: []

    },
    onLoad: function(n) {},
    submitInfo: function(o) {
        this.saveFormId(o);
        let e = n.globalData.userInfo;
        let a = new Object();
        o.detail.value.phone, o.detail.value.weixin, e.nickName;
        let openId = wx.getStorageSync("openid");
        let formIds = this.data.formIdArray.join(',');
        util.request(api.UserSubmitPhone, {uid: openId, mobile:this.data.mobile, wechatId: this.data.wechatId, formIds:formIds}, 'POST').then(res => {

            if(res.errno == 0){
                setTimeout(function() {
                    wx.reLaunch({
                        url: "/pages/index/index"
                    })
                }, 400);
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
    saveFormId: function (v) {
        this.data.formIdArray.push(v.detail.formId);
        /*  if (v.detail.formId != 'the formId is a mock one') {
         this.data.formIdArray.push(v.detail.formId);
         }*/

    },
    inputMobile: function (v) {
        this.data.mobile = v.detail.value
    },
    inputWechatId: function (v) {
        this.data.wechatId = v.detail.value
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