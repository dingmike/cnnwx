let t = getApp(), a = wx.getBackgroundAudioManager(), e = wx.createInnerAudioContext(), o = wx.getRecorderManager();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp();
Page({
    data: {
        detailIndex: 0,
        previousSty: false,
        nextSty: true,
        playing: false,
        isPlayingMusic: false,
        yuyinData: true,
        voiceCon: false,
        recordTime: 0,
        startPlay: false,
        playingUi: {
            play: "/static/image/recorder.png",
            playing: "/static/image/recorder.gif",
            playbtn: "/static/image/start.png",
            playingbtn: "/static/image/stop.png"
        },
        completeSty: false
    },
    onLoad: function(a) {
        wx.showNavigationBarLoading();
        this.setData({
            type: t.globalData.type
        });
        var e = t.globalData.userInfo.avatarUrl;
        this.setData({
            avatarUrl: e
        });
        var o = a.oid;
        this.setData({
            oid: o
        });
        this.getOraleDetail(o);
    },
    getOraleDetail(days){
        // type 学习类型 days学习第几天
        util.request(api.GetOraleDetail, {days: days, type: 1, uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            let o = res.data;
            for(let e=0; e<o.length; e++){
                if(o[e].oralesound){
                    o[e].oralesound = o[e].oralesound.replace(/\\/g, "/");
                }
            }
            this.setData({
                oraleDetail: o
            });
            this.getStorage();
            wx.hideNavigationBarLoading();
        })
    },
    formSubmit(a){
        wx.showNavigationBarLoading();
        var e = a.detail.formId, o = t.globalData.openid, s = t.globalData.type, i = t.globalData.userInfo;
        let unlocks = t.globalData.single.unlocks;
        util.request(api.SetCardById, {type: app.globalData.learnTypeId1, uid: wx.getStorageSync('openid'), formId: e},  'POST').then( res =>{
                wx.hideNavigationBarLoading();
                let a = "今日打卡成功！";
                if(res.data===0){
                    (a = "今日已经打过卡！", wx.showModal({
                        title: "提示",
                        content: a,
                        showCancel: false,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/signres/signres"
                            });
                        }
                    }));
                }else if(res.data===21){
                    (a = "您已完成"+t.globalData.type+'!', wx.showModal({
                        title: "提示",
                        content: a,
                        showCancel: false,
                        confirmText:'查看记录',
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/ucenter/my-card/my-card"
                            });
                        }
                    }));
                }else{
                    wx.redirectTo({
                        url: "/pages/signres/signres"
                    });
                }

               /* res.data || (a = "今日已经打过卡！", wx.showModal({
                    title: "提示",
                    content: a,
                    showCancel: false,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/signres/signres"
                        });
                    }
                }));*/


        })
    },
    completeTap: function() {
        console.log("完成练习");
    },
    Recordinterrupt(){

    },
    nextOrale: function() {
        wx.stopBackgroundAudio();
        var t = this.data.detailIndex;
        t += 1, this.setData({
            detailIndex: t,
            voiceCon: false,
            currentPosition: 0,
            cuo1: false,
            cuo2: false,
            cuo3: false,
            cuo4: false
        }), this.getStorage();
    },
    previousOrale: function() {
        wx.stopBackgroundAudio();
        var t = this.data.detailIndex;
        t -= 1, this.setData({
            detailIndex: t,
            voiceCon: false,
            currentPosition: 0,
            cuo1: false,
            cuo2: false,
            cuo3: false,
            cuo4: false
        }), this.getStorage();
    },
    dddd: function() {
        wx.getSavedFileList({
            success: function(t) {
                console.log(t);
            }
        });
    },
    Recording: function() {
        o.start(), wx.pauseBackgroundAudio(), wx.showToast({
            title: "录音中...",
            duration: 6e4,
            icon: "loading"
        }), this.setData({
            isPlayingMusic: false,
            playing: true
        });
    },
    Recordingend: function() {
        var t = this;
        o.stop(), this.setData({
            playing: false
        }), o.onStop(function(a) {
            var e = a.tempFilePath, o = a.duration;
            t.setData({
                recordTime: o
            }), wx.saveFile({
                tempFilePath: e,
                success: function(a) {
                    var e = a.savedFilePath, s = t.data.oid, i = t.data.detailIndex, n = t.data.type + "voice" + s + i, l = wx.getStorageSync(n);
                    l && wx.removeSavedFile({
                        filePath: l[0],
                        complete: function(t) {
                           console.log("结果");
                        }
                    });
                    var c = [ e, o ];
                    wx.setStorageSync(n, c), t.getStorage(), t.setData({
                        savedFilePath: e
                    });
                }
            });
        }), wx.hideToast(), o.onError(function(t) {
             wx.getSetting({
                success: function(t) {
                    t.authSetting["scope.record"] ? console.log("未知错误") : wx.showModal({
                        title: "提示",
                        content: "没有授权无法录音",
                        confirmText: "去授权",
                        success: function(t) {
                            t.confirm && wx.getSetting({
                                success: function(t) {
                                    t.authSetting["scope.record"] || wx.openSetting({
                                        success: function(t) {}
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    getStorage: function() {
        var t = this.data.oid, a = this.data.detailIndex, e = this.data.oraleDetail;
        // this.getBackStatus(); // 暂时不需要音频
        this.setData({
            startPlay: false,
            isPlayingMusic: false,
            selectedAns: false
        }), e[a + 1] ? e[a - 1] ? this.setData({
            previousSty: true,
            nextSty: true,
            completeSty: false
        }) : this.setData({
            previousSty: false,
            completeSty: false
        }) : this.setData({
            nextSty: false,
            completeSty: false
        });
        var o = this.data.type + "voice" + t + a;
        var s = wx.getStorageSync(o);
        s && 4 == a && this.setData({
            completeSty: true,
            nextSty: false
        }), e[a].typeof ? this.setData({
            datiData: true,
            yuyinData: false
        }) : this.setData({
            datiData: false,
            yuyinData: true
        }), s ? this.setData({
            nextSty: true,
            voiceCon: true
        }) : this.setData({
            nextSty: false,
            completeSty: false
        }), a > 2 && this.setData({
            nextSty: false,
            completeSty: false
        });
    },
    playVoice: function() {
        this.data.savedFilePath;
        var t = this.data.type + "voice" + this.data.oid + this.data.detailIndex, a = wx.getStorageSync(t);
        e.src = a[0];
        var o = a[1], s = this;
        this.data.startPlay ? (e.pause(), this.setData({
            startPlay: false
        })) : (e.play(), this.setData({
            startPlay: true
        })), setTimeout(function() {
            s.setData({
                startPlay: false,
                playing: false
            });
        }, o + 500);
    },
    getBackStatus: function() {
        var t = this.data.oraleDetail, e = this.data.detailIndex, o = this;
        t[e].oralesound && (a.src = t[e].oralesound, a.stop(),
        a.src = t[e].oralesound, a.title = "今日重点", a.onPlay(function() {
            wx.hideNavigationBarLoading(), a.pause();
            var t = setInterval(function() {
                var e = a.duration;
                e && 0 != e && (o.setData({
                    audioMax: e
                }), clearInterval(t));
            }, 1000);
        }));
    },
    startPlay: function() {
        var t = this, e = this.data.isPlayingMusic, o = this.data.oraleDetail, s = this.data.detailIndex;
        console.log(o[s].oralesound), e ? (a.pause(), this.setData({
            isPlayingMusic: false
        })) : (a.src || (a.src = o[s].oralesound), a.title = "今日重点", a.play(), a.onPlay(function() {
            var e = setInterval(function() {
                var o = a.duration;
                o && 0 != o && t.setData({
                    audioMax: o
                });
                var s = a.duration, i = Math.round(a.currentTime);
                t.setData({
                    currentPosition: i
                });
                var n = Math.round(s - i);
                Math.floor(n / 60), (n % 60 / 100).toFixed(2).slice(-2);
                a.paused && clearInterval(e), 0 != n && 1 != n || (t.setData({
                    isPlayingMusic: false,
                    currentPosition: 0
                }), clearInterval(e), a.stop());
            }, 1000);
        }), this.setData({
            isPlayingMusic: true
        }));
    },
    sliderchange: function(t) {
        wx.seekBackgroundAudio({
            position: t.detail.value
        });
    },
    optcs1: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo1: true
        });
    },
    optcs2: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo2: true
        });
    },
    optcs3: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo3: true
        });
    },
    optcs4: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo4: true
        });
    },
    subAnsTap: function(t) {
        console.log(t);
        var a = this.data.oraleDetail, e = this.data.detailIndex, o = t.currentTarget.dataset.number;
        1 == a[e].copt && this.setData({
            cuo1: true
        }), 2 == a[e].copt && this.setData({
            cuo2: true
        }), 3 == a[e].copt && this.setData({
            cuo3: true
        }), 4 == a[e].copt && this.setData({
            cuo4: true
        }), 1 == o && this.optcs1(o), 2 == o && this.optcs2(o), 3 == o && this.optcs3(o), 
        4 == o && this.optcs4(o), 4 == e && this.setData({
            completeSty: true,
            nextSty: false
        }), this.setData({
            selectedAns: true,
            nextSty: true
        });
    },
    onHide: function() {
        wx.stopBackgroundAudio();
    }
});