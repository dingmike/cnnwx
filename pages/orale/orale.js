function a(a) {
    return [ parseInt(a / 60 % 60), parseInt(a % 60) ].join(":").replace(/\b(\d)\b/g, "0$1");
}
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var t = getApp(), o = wx.getBackgroundAudioManager(), e = require("../../utils/dakaUtil.js");

Page({
    data: {
        isPlayingMusic: false,
        dqTime: "0:00"
    },
    onLoad: function(a) {
        wx.showNavigationBarLoading();
        var o = t.globalData.days, e = t.globalData.type;
        this.getContent(o, e);
    },
    getContent(a, o){
        var e = this;
        util.request(api.GetGongduContent, {days: a, type: 1, uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            var o = res.data;
            o.oralesound = o.oraleSound.replace(/\\/g, "/");
            o.extendsound = o.extendSound.replace(/\\/g, "/");
            wx.hideLoading();
            t.globalData.oraleCountent = o;
            e.setData({
                oraleContent: o
            });
            e.playVoice();
        })
    },
    playVoice: function() {
        var a = this;
        t = this.data.oraleContent;
        t && (o.src = t.oralesound, o.stop(), o.src = t.oralesound,
        o.title = t.title, o.onPlay(function() {
            wx.hideNavigationBarLoading(), o.pause();
            var t = setInterval(function() {
                var n = o.duration;
                n && 0 != n && (a.setData({
                    audioMax: n,
                    dqTime: e.formatSeconds(n)
                }), clearInterval(t));
            }, 1e3);
        }));
    },
    sliderchange: function(a) {
        wx.seekBackgroundAudio({
            position: a.detail.value
        });
    },
    startPlay: function() {
        var t = this, n = this.data.oraleContent;
        this.data.isPlayingMusic ? (o.pause(), this.setData({
            isPlayingMusic: !1
        })) : (console.log(o.src), o.src || (o.src = n.oralesound), o.play(), o.title = n.title,
        o.onPlay(function() {
            console.log("音乐进度变化");
            setInterval(function() {
                var n = o.duration;
                n && 0 != n && t.setData({
                    audioMax: n,
                    dqTime: e.formatSeconds(n)
                });
                var i = o.duration, s = o.currentTime;
                t.setData({
                    currentPosition: s
                }), console.log(Math.round(t.data.currentPosition));
                var l = Math.round(i - s), r = a(l);
                console.log(r), 1 == l || 0 == l ? (t.setData({
                    isPlayingMusic: !1,
                    dqTime: e.formatSeconds(i),
                    currentPosition: 0
                }), o.stop()) : t.setData({
                    dqTime: r
                });
            }, 1e3);
        }), this.setData({
            isPlayingMusic: !0
        }));
    },
    getAudioStatus: function() {
        var a = this;
        setTimeout(function() {
            wx.getBackgroundAudioPlayerState({
                success: function(t) {
                    t.status, t.dataUrl, t.currentPosition;
                    var o = e.formatSeconds(t.duration);
                    console.log("-" + o);
                    a.setData({
                        Totalschedule: o
                    });
                },
                fail: function(a) {
                    console.log(a);
                }
            });
        }, 1e3);
    },
    continueStudy: function() {
        var a = this.data.oraleContent;
        wx.navigateTo({
            url: "./orale-detail/orale-detail?oid=" + a.id
        });
    },
    onShow: function() {
        this.setData({
            isPlayingMusic: false
        });
        t.globalData.days, t.globalData.type;
        console.log("onshow"), console.log(o.paused), this.playVoice();
    },
    onHide: function() {
        wx.stopBackgroundAudio();
    }
});