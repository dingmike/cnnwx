function a(a) {
    return [parseInt(a / 60 % 60), parseInt(a % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
}
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
let t = getApp();
let o = wx.getBackgroundAudioManager(), e = require("../../utils/dakaUtil.js");

Page({
    data: {
        isPlayingMusic: false,
        src: '',
        isOpen: false,//播放开关
        starttime: '00:00', //正在播放时长
    },
    onLoad: function (a) {
        //new add
        this.audioCtx = wx.createAudioContext('myAudio');
        //---------
        wx.showNavigationBarLoading();
        var o = t.globalData.days, e = t.globalData.type;
        this.getContent(o, e);
    },
    getContent(a, o){
        var e = this;
        util.request(api.GetGongduContent, {days: a, type: 1, uid: wx.getStorageSync('openid')}, 'POST').then(res => {
            wx.hideNavigationBarLoading();
            var o = res.data;
            o.oraleSound = o.oraleSound.replace(/\\/g, "/");
            o.extendSound = o.extendSound.replace(/\\/g, "/");
            t.globalData.oraleCountent = o;
            t.globalData.bgimg = o.scenceImg;
            e.setData({
                oraleContent: o,
                src: o.oraleSound
            });
        })
    },
    continueStudy: function () {
        var a = this.data.oraleContent;
        wx.navigateTo({
            url: "./orale-detail/orale-detail?oid=" + a.genusDays
        });
    },
    onShow: function () {
        this.setData({
            isPlayingMusic: false
        });
        t.globalData.days, t.globalData.type;
    },
    onHide: function () {
        this.audioPause();
    },

//    news add
//开始播放
    audioPlay: function () {
        this.audioCtx.play();
        this.setData({
            isOpen: true
        })
    },

//暂停播放
    audioPause: function () {
        this.audioCtx.pause();
        this.setData({
            isOpen: false
        })
    },
//拖动进度条
    sliderChange(e) {
        var offset = parseInt(e.detail.value);
        this.audioCtx.seek(offset);
    },
//监听播放时长
    updata(e) {
        // console.log(e)
        var that = this;
        var offset = parseInt(offset * 100 / duration);
        var duration = e.detail.duration; //总时长
        var offset = e.detail.currentTime; //当前播放时长
        var currentTime = parseInt(e.detail.currentTime);
        var min = "0" + parseInt(currentTime / 60);
        var max = parseInt(e.detail.duration);
        var sec = currentTime % 60;
        if (sec < 10) {
            sec = "0" + sec;
        };
        var starttime = min + ':' + sec;
        /* 00:00 */
        that.setData({
            offset: currentTime,
            starttime: starttime,
            max: max
        })
//判断音频播放结束
        if (offset >= duration) {
            that.setData({
                starttime: '00:00', //正在播放时长
                isOpen: false,
                offset: 0
            })
        }
    }
});