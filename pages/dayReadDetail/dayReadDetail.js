var a = require("./../../utils/util");
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var t = getApp();
// var i = require("../../utils/xmadx_sdk.min.js").xmad(i).xmPage;
Page({
    data: {
        pageDetail: [],
        transList: [],
        voiceList: [],
        isShow: !0,
        isShowAudio: !0,
        newsId:'',
        listPage: 0,
        haveReadedOver: false,
        showSetCardBtn: false, // 显示下部打卡按钮听完才显示
        showCardBtn: true, // 打卡按钮
        useTime: 0,
        startTime:'',
        endTime:'',
        xmad: {
            adData: {},
            ad: {
                banner: "xm72ed4c216f8411f542714b3d048d58"
            }
        }
    },
    onTap: function(a) {
        t.push.add(a);
        var i = this, s = a.currentTarget.dataset.value, e = i.data.transList;
        e[s] = !i.data.transList[s], i.setData({
            transList: e
        });
    },
    onTapVoice: function(a) {
        debugger
        t.push.add(a);
        var i = this, s = a.currentTarget.dataset.value, e = [];
        i.data.voiceList.map(function(a, t) {
            s == t ? e.push(!i.data.voiceList[t]) : e.push(!1);
        });
        var n = "viode" + s, d = wx.createAudioContext(n);
        e[s] ? d.play() : d.pause(), i.setData({
            voiceList: e
        });
    },
    voiceEnd: function(a) {
        debugger
        var t = this;
        if(t.data.listPage==0){
            t.setData({
                showSetCardBtn: !0,
                showCardBtn: !0
            });
        }
        //关闭音频
        let d = wx.createAudioContext("viode0");
        d.pause();
        t.setData({
            voiceList: [false]
        });
       // t.showPopup();
    },
    onReady () {
        // 页面渲染完成
        // var timestamp = Date.parse(new Date());
        this.setData({
            startTime: Date.parse(new Date())
        })
    },
    onLoad: function(t) {
        debugger
        var i = this;
        //listPage=0的时候是今日打卡文章，1的时候是列表文章详情
        if(t.listPage==1){
            //列表文章查看
            i.getNewsDetail(t);
        }else{
            //当天打卡文章
            i.getTodayNews(t);
        }
    },
    sureHaveReaded(res){
        let that=this;
        util.request(api.HaveReaded, {uid: wx.getStorageSync('openid'),id: res.data.id},'POST').then( res =>{
            if(res.data==1){
                //已阅读过了
                that.setData({
                    haveReadedOver: true
                })
            }else{
                that.setData({
                    haveReadedOver: false
                })





            }
        })
    },
    getTodayNews(t){
        // GetTodayNews
        var i =this;
        util.request(api.GetTodayNews).then( res =>{


            // i.sureHaveReaded(res);

                var t = [], s = [],content=[];
                res.data.addTime = util.tsFormatTime(res.data.addTime,'Y-M-D');
                // res.data.newsDetail =  res.data.newsDetail.replace('/\<img/g', '<img style="width:100%;height:auto;display:block" ');
                // res.data.chinese =  res.data.chinese.replace('/\<img/g' , '<img style="width:100%;height:auto;display:block" ');
                content.push(res.data);
                content.map(function(a, i) {
                    t.push(!1), s.push(!1);
                });
                i.setData({
                    pageDetail: content,
                    transList: t,
                    voiceList: s,
                    newsId: res.data.id
                });
            // WxParse.wxParse('newsHtmlDetail', 'html', res.data.newsDetail, i,5);
            // WxParse.wxParse('chineseDetail', 'html', res.data.chinese, i);
        })
    },
    getNewsDetail(t){
        var i =this;
        i.setData({
            newsId: t.pageId,
            listPage: t.listPage
        });
        util.request(api.GetNewsById, {pageId: t.pageId},'POST').then( res =>{
            var t = [], s = [],content=[];
            res.data.addTime = util.tsFormatTime(res.data.addTime,'Y-M-D');


            content.push(res.data);
            content.map(function(a, i) {
                t.push(!1), s.push(!1);
            });
            i.setData({
                pageDetail: content,
                transList: t,
                voiceList: s
            });
            // WxParse.wxParse('newsHtmlDetail', 'html', res.data.newsDetail, i,5);
            // WxParse.wxParse('chineseDetail', 'html', res.data.chinese, i);
        })
    },
    longTap(){
        wx.showToast({
            title: '继续加油！',
            duration: 800,
            mask:false
        })
    },
    showPopup() {
        let popupComponent = this.selectComponent('.J_Popup');
        popupComponent && popupComponent.show();
    },
    hidePopup() {
        let popupComponent = this.selectComponent('.J_Popup');
        popupComponent && popupComponent.hide();
    },
    showNewsCard(){
      this.showPopup();
    },
    setNewsCard(){
        var that =this;
        that.setData({
            useTime: Date.parse(new Date())-that.data.startTime
        });
        util.request(api.SetNewsCard, {newsId: that.data.newsId, useTime: that.data.useTime/1000, learnTypeId: t.globalData.learnTypeId2}, 'POST').then( res =>{
            if(res.data===1){
                wx.showModal({
                    title: '打卡成功',
                    content: '学习用时'+(that.data.useTime/1000/60).toFixed(2)+'分钟,获得1积分',
                    showCancel: false,
                    confirmText: '去换东西',
                    success:function (res) {
                        if(res.confirm){
                            wx.switchTab({
                                url: "/pages/mall/mall"
                            });
                        }
                    }
                });
            }
        })
    }
});