var a = getApp(), t = wx.getBackgroundAudioManager(), i = require("../../../utils/util.js");

Page({
    data: {
        isPlayingMusic: !1,
        dqTime: "0:00"
    },
    onLoad: function(a) {
        wx.showNavigationBarLoading(), this.getOraleData();
    },
    getOraleData: function() {
        var t = a.globalData.oraleCountent;
        this.setData({
            oraleContent: t
        }), this.playVoice();
    },
    playVoice: function() {
        var a = this, n = this.data.oraleContent;
        console.log(n.extendsound), t.src = n.extendsound, t.title = "扩展内容", t.onPlay(function() {
            wx.hideNavigationBarLoading(), t.pause();
            var n = setInterval(function() {
                var o = t.duration;
                o && 0 != o && (a.setData({
                    audioMax: o,
                    dqTime: i.formatSeconds(o)
                }), clearInterval(n));
            }, 1e3);
        });
    },
    sliderchange: function(a) {
        wx.seekBackgroundAudio({
            position: a.detail.value
        });
    },
    startPlay: function() {
        var a = this, n = this.data.oraleContent;
        this.data.isPlayingMusic ? (t.pause(), this.setData({
            isPlayingMusic: !1
        })) : (console.log(t.src), t.src || (t.src = n.oralesound), t.play(), t.title = n.title, 
        t.onPlay(function() {
            console.log("音乐进度变化");
            var n = setInterval(function() {
                var o = t.duration;
                o && 0 != o && a.setData({
                    audioMax: o
                });
                var e = t.duration, s = t.currentTime;
                a.setData({
                    currentPosition: s
                });
                var r = Math.round(e - s), u = Math.floor(r / 60) + ":" + (r % 60 / 100).toFixed(2).slice(-2);
                console.log(r), t.paused && clearInterval(n), 1 == r || 0 == r ? (a.setData({
                    isPlayingMusic: !1,
                    dqTime: i.formatSeconds(e),
                    currentPosition: 0
                }), t.stop()) : a.setData({
                    dqTime: u
                });
            }, 1e3);
        }), this.setData({
            isPlayingMusic: !0
        }));
    },
    continueStudy: function() {
        wx.reLaunch({
            url: "../../index/index"
        });
    },
    onShow: function() {
        this.setData({
            isPlayingMusic: !1
        }), console.log("页面显示");
    },
    onHide: function() {
        wx.stopBackgroundAudio();
    }
});