const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        poem: "",
        current_poem_url: "",
        share: "",
        uid: ""
    },

    showToast() {
        let $toast = this.selectComponent(".J_toast")
        $toast && $toast.show()
    },
    onShareAppMessage: function () {
        return {
            desc: 'FecsTec English',
            title: this.data.share.share_title,
            imageUrl: this.data.share.share_img,
            path: "pages/index/index?uid=" + this.data.uid
        }
    },
    onLoad: function (t) {
        t.uid && this.setData({
            uid: t.uid
        });
        var e = this.getData;
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
    },
    getData: function() {

        let that = this;
        var e = this, i = t.globalData.url + "/index.php?m=Mini&c=Poetry&a=index", n = {};

        util.request(api.ReadRecord).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    poem: t.data.list,
                    share: t.data.share,
                    uid: t.data.uid
                });
            }
        });

        /*app.request_post(i, n, function(t) {
            if (e.data.uid.length > 0) {
                var i = "https://fudai.i-meihao.shop/index.php?m=Mini&c=Poetry&a=help&uid=" + e.data.uid;
                app.request_post(i, {}, {}, 1);
            }
            e.setData({
                poem: t.data.list,
                share: t.data.share,
                uid: t.data.uid
            });
        }, 0);*/
    },
    navigateTo: function(t) {
        wx.navigateTo(t);
    },
    select_poem: function(t) {
        this.setData({
            current_poem_url: t.currentTarget.dataset.url
        });
    }
})
