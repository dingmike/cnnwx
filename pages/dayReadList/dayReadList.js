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

        e.save(), wx.showShareMenu({
            withShareTicket: !0
        });
        var a = this;
        wx.getSystemInfo({
            success: function (res) {
                a.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        a.getNewsList();
        wx.request({
            url: util.host + "duenglish/list?t=chinaplus_cri_news",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    newsList: t.data
                });
            }
        }), wx.request({
            url: util.host + "motto_en",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    slogan: t.data
                });
            }
        });
    },
    getLearnInfo() {
        util.request(api.GetLearnInfo, {uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            wx.hideNavigationBarLoading();
            if (res.errno === 0&&res.data) {
                wx.hideLoading();
                let studyNums = [];
                for(let i=1; i<=res.data.genusdays; i++){
                    studyNums.push({genusdays: i})
                }
                this.setData({
                    studyNums: studyNums
                });

                app.globalData.single = res.data;
                this.setData({
                    single: res.data,
                    Contents: true
                });

                if(res.data.startStatus == 1){ // 已支付开始学习
                    this.setData({
                        avaData: true,
                        userInfo: res.data
                    })

                }else{ // 没支付
                    this.setData({
                        contact: false,
                        joinBtn: '马上加入学习',
                        setTimeSty: false
                    });

                }

                if(16 == res.data.unlocks){
                    this.getOneCard(res.data.unlocks);

                }else{
                    this.getOneCard();
                }

            }else{
                let mockData = {
                    "id": "",
                    "learnTypeId": 0,
                    "userid": 0,
                    "unlocks": 0,
                    "formId": "",
                    "miss": 0,
                    "startStatus": 0,
                    "setupTime": "",
                    "addTime": "",
                    "updateTime": "",
                    "userName": "",
                    "avatar": "",
                    "nickname": "",
                    "learnType": "",
                    "genusdays": 21
                };
                let studyNums = [];
                for(let i=1; i<=mockData.genusdays; i++){
                    studyNums.push({genusdays: i})
                }
                this.setData({
                    studyNums: studyNums,
                    contact: false,
                    joinBtn: '马上加入学习',
                    setTimeSty: false,
                    single: mockData,
                    Contents: !0
                });
            }

        });
    },
    getNewsList(){
        var that = this;
        if (that.data.totalPages <= that.data.page-1) {
            that.setData({
                nomore: true
            })
            return;
        }
        util.request(api.GetReadNewsByUserId, {uid: wx.getStorageSync('openid'),page: that.data.page, size: that.data.size}).then( res =>{
            that.setData({
                cnnNewsList: that.data.cnnNewsList.concat(res.data.data),
                page: res.data.currentPage+1,
                totalPages: res.data.totalPages
            })

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
            url: "../dayReadDetail/dayReadDetail?pageId=" + t.currentTarget.dataset.value
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
    cancelmove: function(t) {
        console.log(t);
    },
    savecanvaspic: function() {
        var t = this;
        wx.showLoading({
            title: "制作中"
        }), wx.canvasToTempFilePath({
            canvasId: "sharepage",
            success: function(e) {
                wx.hideLoading(), wx.showLoading({
                    title: "保存中"
                }), wx.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function(e) {
                        wx.hideLoading(), wx.showToast({
                            title: "已保存到相册",
                            icon: "success",
                            duration: 2e3
                        }), t.setData({
                            showbg: !1
                        });
                    }
                });
            }
        });
    },
    cancelcanvaspic: function() {
        this.setData({
            showbg: !1
        });
    }
});