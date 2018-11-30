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
        userReaded:[],
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
    onShow(){
        wx.setNavigationBarTitle({
            title: "全部文章"
        });
        // this.getAllUserReadNewsId();
    },
    getAllUserReadNewsId(allNews){
        let that =this;
        util.request(api.GetAllReadNewsId, {uid: wx.getStorageSync('openid')}).then( res =>{
            if(res.errno===0&&res.data){
                console.log(res.data);
                allNews.data.map((item, index, arr) => {
                    res.data.some((item2, index2, arr2)=>{
                        if(item2==item.id){
                            allNews.data[index].isReaded= true;
                            return true;
                        }else{
                            allNews.data[index].isReaded= false;
                        }
                    })
                })

                that.setData({
                    cnnNewsList: that.data.cnnNewsList.concat(allNews.data),
                    page: allNews.currentPage+1,
                    totalPages: allNews.totalPages
                })


                that.setData({
                    userReaded: res.data
                });
            }
        })
    },
    getNewsList(){
        let that = this;
        if (that.data.totalPages <= that.data.page-1) {
            that.setData({
                nomore: true
            });
            return;
        }
        //获取全部文章
        util.request(api.GetAllNews, {uid: wx.getStorageSync('openid'),page: that.data.page, size: that.data.size}).then( res =>{
            if(res.errno===0&&res.data){
                if(res.data.data.length!==0){
                    res.data.data.map((obj,index,array)=>{
                        obj.addTime=util.tsFormatTime(obj.addTime,'Y-M-D');
                    });

                    that.getAllUserReadNewsId(res.data);

                   /* that.setData({
                        cnnNewsList: that.data.cnnNewsList.concat(res.data.data),
                        page: res.data.currentPage+1,
                        totalPages: res.data.totalPages
                    })*/
                }else{
                    that.setData({
                        listTitle:'空空如也~'
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
        let listPage='1';
        if(t.currentTarget.dataset.readed){
            listPage='1';
        }else{
            listPage='0';
        }
        //1 已读文章无法打卡 0可以打卡
        wx.navigateTo({
            url: "../dayReadDetail/dayReadDetail?today=0&listPage="+ listPage + "&pageId=" + t.currentTarget.dataset.value
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