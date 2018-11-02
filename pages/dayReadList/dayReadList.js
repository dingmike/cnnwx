// var t = require("./../../utils/util");
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const pay = require('../../services/pay');
var e = require("./../../utils/share"), a = getApp();

Page({
    data: {
        showSlogan: !0,
        newsList: [],
        slogan: {},
        edata: "",
        userInfo: {},
        scrollTop: 0,
        scrollHeight: 0,
        page: 1,
        size: 10,
        loadmoreText: '正在加载更多数据',
        nomoreText: '全部加载完成',
        listTitle:'正在加载...',//已打卡文章
        nomore: false,
        totalPages: 1,
        cnnNewsList:[],
        showbg: !1,
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        btnDisabled: true,
        btnText: '去阅读打卡',
        style: 'width: 222rpx;background: #58b406;border-radius: 66rpx;color: #fff;',
    },

    onLoad: function() {
        var a = this;
        wx.getSystemInfo({
            success: function (res) {
                a.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        a.getNewsList();
    },
    getNewsList(){
        let that = this;
        if (that.data.totalPages <= that.data.page-1) {
            that.setData({
                nomore: true
            });
            return;
        }
        util.request(api.GetReadNewsByUserId, {uid: wx.getStorageSync('openid'),page: that.data.page, size: that.data.size}).then( res =>{
            if(res.errno===0&&res.data){
                if(res.data.data.length!==0){
                    res.data.data.map((obj,index,array)=>{
                        obj.addTime=util.tsFormatTime(obj.addTime,'Y-M-D');
                    })
                    that.setData({
                        listTitle:'已打卡文章',
                        cnnNewsList: that.data.cnnNewsList.concat(res.data.data),
                        page: res.data.currentPage+1,
                        totalPages: res.data.totalPages
                    })
                }else{
                    that.setData({
                        listTitle:'还没有学习过的文章'
                    })
                }
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("下一页")
        this.getNewsList()
    },
    detailPage: function(t) {
        wx.navigateTo({
            url: "../dayReadDetail/dayReadDetail?listPage=1&pageId=" + t.currentTarget.dataset.value
        });
    },
    push: function(t) {
        a.push.add(t);
    },
    getUserInfo: function(t) {
        try {
            wx.showLoading({
                title: "生成中"
            }), t.detail.userInfo ? (a.globalData.userInfo = t.detail.userInfo, this.setData({
                userInfo: t.detail.userInfo
            }), e.tosavePic(this)) : wx.hideLoading();
        } catch (t) {
            wx.hideLoading();
        }
    },
    //去阅读当天的打卡内容
    goReadToday(){



        wx.navigateTo({
            url: "../dayReadDetail/dayReadDetail?listPage=0"
        });
    }
});