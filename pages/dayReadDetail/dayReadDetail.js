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
        showSetCardBtn: true,
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
        t.setData({
            showSetCardBtn: !0
        });
       // t.showPopup();
    },
    onLoad: function(t) {
        var i = this;
        i.getNewsDetail(t);
       /* util.request(api.GetNewsById, {pageId: t.pageId},'POST').then( res =>{
            var t = [], s = [],content=[];
            res.data.addTime = util.tsFormatTime(res.data.addTime,'Y-M-D');
            WxParse.wxParse('newsHtmlDetail', 'html', res.data.newsDetail, i);
            WxParse.wxParse('chineseDetail', 'html', res.data.chinese, i);
            content.push(res.data);
            content.map(function(a, i) {
                t.push(!1), s.push(!1);
            });
            i.setData({
                pageDetail: content,
                transList: t,
                voiceList: s
            });
        })*/
        wx.request({
            url: a.host + "duenglish/detail?aid=194979",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a)
            }
        });
    },
    getNewsDetail(t){
        var i =this;
        i.setData({
            newsId: t.pageId
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
        util.request(api.SetNewsCard, {newsId: this.data.newsId},'POST').then( res =>{
            debugger
        })
    }
});