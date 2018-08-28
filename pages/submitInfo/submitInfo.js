var n = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
    data: {
        userInfo: {},
        phone:'',
        weixin:'',
        formIdArray: []

    },
    onLoad: function(n) {},
    submitInfo: function(o) {
        this.saveFormId(o);
        let e = n.globalData.userInfo;
        let a = new Object();
        o.detail.value.phone, o.detail.value.weixin, e.nickName;
        let t = wx.getStorageSync("openid");
        let formIds = this.data.formIdArray.join(',');
        util.request(api.UserSubmitPhone, {uid: t,mobile:this.data.phone, wechatId: this.data.weixin, formIds:formIds}, 'POST').then(res => {

            if(res.errno == 0){
                wx.reLaunch({
                    url: "/pages/index/index"
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
    saveFormId: function (v) {
        this.data.formIdArray.push(v.detail.formId);
      /*  if (v.detail.formId != 'the formId is a mock one') {
            this.data.formIdArray.push(v.detail.formId);
        }*/

    },
    inputAccount: function (v) {
        this.data.account = v.detail.value
    },
    inputPsw: function (v) {
        this.data.password = v.detail.value
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