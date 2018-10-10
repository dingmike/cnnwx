const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp();
Page({
    data: {
        newGoods: [],
        hotGoods: [],
        topics: [],
        brands: [],
        floorGoods: [],
        banner: [],
        channel: []
    },
    onShareAppMessage: function () {
        return {
            title: '爱学习小店',
            desc: '英文能力',
            path: '/pages/mall/mall'
        }
    },
    onPullDownRefresh(){
        // 增加下拉刷新数据的功能
        var self = this;
        this.getIndexData();
    },
    getIndexData: function () {
        let that = this;
     /*   util.request(api.IndexUrl).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    newGoods: res.data.newGoodsList,
                    hotGoods: res.data.hotGoodsList,
                    topics: res.data.topicList,
                    brand: res.data.brandList,
                    floorGoods: res.data.categoryList,
                    banner: res.data.banner,
                    channel: res.data.channel
                });
            }
        });*/
        var data = new Object();
        /*util.request(api.IndexUrlNewGoods).then(function (res) {
            if (res.errno === 0) {
                data.newGoods= res.data.newGoodsList
                that.setData(data);
            }
        });
        util.request(api.IndexUrlHotGoods).then(function (res) {
            if (res.errno === 0) {
                data.hotGoods = res.data.hotGoodsList
                that.setData(data);
            }
        });
        util.request(api.IndexUrlTopic).then(function (res) {
            if (res.errno === 0) {
                data.topics = res.data.topicList
                that.setData(data);
            }
        });
        util.request(api.IndexUrlBrand).then(function (res) {
            if (res.errno === 0) {
                data.brand = res.data.brandList
                that.setData(data);
            }
        });*/
        util.request(api.IndexUrlCategory).then(function (res) {
            if (res.errno === 0) {
                data.floorGoods = res.data.categoryList
                that.setData(data);
            }
        });
       /* util.request(api.IndexUrlBanner).then(function (res) {

            if (res.errno === 0) {
                data.banner = res.data.banner
                that.setData(data);
            }
        });
        util.request(api.IndexUrlChannel).then(function (res) {
            if (res.errno === 0) {
                data.channel = res.data.channel
                that.setData(data);
            }
        });*/
    },
    onLoad: function (options) {
        this.getIndexData();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        wx.setNavigationBarTitle({
            title: "爱学习小店"
        });
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
})
