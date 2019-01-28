const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        dataList: []
    },
    onLoad: function () {
    },
    onShow: function () {
        this.get_rank_list();
    },
    onPullDownRefresh: function () { //下拉刷新
        wx.stopPullDownRefresh();
        this.get_rank_list();
    },
    get_rank_list: function(){
        var that = this;
        wx.showNavigationBarLoading();
        util.request(api.GetRankList, {limit: 10, order: 1}, 'post').then(res => {
            res.data.forEach((obj, index, arr)=>{
                obj.rank = index+1;
            })
            that.setData({
                dataList: res.data
            });
            wx.hideNavigationBarLoading();
        })

    },
    onShareAppMessage: function () {
        return {
            title: '每日阅读计划',
            desc: '努力成为更好的自己',
            path: '/pages/rank/rank'
        }
    }
})
