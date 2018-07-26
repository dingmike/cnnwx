var t = getApp(), a = wx.getBackgroundAudioManager(), e = wx.createInnerAudioContext(), o = wx.getRecorderManager();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({
    data: {
        detailIndex: 0,
        previousSty: !1,
        nextSty: !0,
        playing: !1,
        isPlayingMusic: !1,
        yuyinData: !0,
        voiceCon: !1,
        recordTime: 0,
        startPlay: !1,
        playingUi: {
            play: "/static/image/recorder.png",
            playing: "/static/image/recorder.gif",
            playbtn: "/static/image/start.png",
            playingbtn: "/static/image/stop.png"
        },
        completeSty: !1
    },
    onLoad: function(a) {
        wx.showNavigationBarLoading(), console.log(t.globalData.type), this.setData({
            type: t.globalData.type
        });
        var e = t.globalData.userInfo.avatar;
        console.log(e), this.setData({
            avatarUrl: e
        });
        var o = a.oid;
        this.setData({
            oid: o
        }), this.getOverview(o);
        var s = this;
        this.getOraleDetail(o);
        // this.getOraleDetailOld(o);

    },
    getOraleDetailOld(o){
        wx.request({
            url: t.globalData.url + "api/orale/getOraleDetail",
            data: {
                oid: o
            },
            success: function(t) {
                console.log(t);
                for (var a = t.data, e = 0; e < a.length; e++) a[e].oralesound = a[e].oralesound.replace(/\\/g, "/");
                s.setData({
                    oraleDetail: a
                }), s.getStorage();
            }
        });
    },
    getOraleDetail(days){
        // type 学习类型 days学习第几天
        util.request(api.GetOraleDetail, {days: days, type: 1, uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
            debugger
            console.log(res);
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


          /*  for (var a = res.data, e = 0; e < a.length; e++) a[e].oralesound = a[e].oralesound.replace(/\\/g, "/");
            this.setData({
                oraleDetail: a
            });
            this.getStorage();*/

            // o.oraleSound = o.oraleSound.replace(/\\/g, "/");
            // o.extendSound = o.extendSound.replace(/\\/g, "/");
            // wx.hideLoading();
            // t.globalData.oraleCountent = o;
            // this.setData({
            //     oraleContent: o
            // });
            // this.playVoice();
        })
    },
    getOverview: function(a) {
        var e = this;
        wx.request({
            url: t.globalData.url + "api/orale/getOverview",
            data: {
                id: a
            },
            success: function(t) {
                e.setData({
                    Overvier: t.data
                });
            }
        });
    },

    formSubmit(a){
        var e = a.detail.formId, o = t.globalData.openid, s = t.globalData.type, i = t.globalData.userInfo;
        let unlocks =   t.globalData.single.unlocks;
        util.request(api.SetCardById, {type: 1, uid: wx.getStorageSync('openid')}, 'POST').then( res =>{
debugger
            if (res.data) wx.redirectTo({
                url: "/pages/signres/signres"
            }); else {
                var a = "今日打卡成功！";
                res.data || (a = "今日已经打过卡！", wx.showModal({
                    title: "提示",
                    content: a,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/signres/signres"
                        });
                    }
                }));
            }

        })
    },
    formSubmit2: function(a) {
        debugger;
        console.log(a);
        var e = a.detail.formId, o = t.globalData.openid, s = t.globalData.type, i = t.globalData.userInfo;
        console.log(o);
        console.log(e);
        wx.request({
            url: t.globalData.url + "api/User/setFormId",
            data: {
                uid: o,
                formid: e,
                type: s,
                username: i.nickName
            },
            success: function(t) {
                if (console.log(t), t.data) wx.redirectTo({
                    url: "/pages/signres/signres"
                }); else {
                    var a = "今日打卡成功！";
                    t.data || (a = "今日已经打过卡！", wx.showModal({
                        title: "提示",
                        content: a,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/signres/signres"
                            });
                        }
                    }));
                }
            }
        });
    },
    completeTap: function() {
        console.log("完成练习");
    },
    nextOrale: function() {
        wx.stopBackgroundAudio();
        var t = this.data.detailIndex;
        t += 1, this.setData({
            detailIndex: t,
            voiceCon: !1,
            currentPosition: 0,
            cuo1: !1,
            cuo2: !1,
            cuo3: !1,
            cuo4: !1
        }), this.getStorage();
    },
    previousOrale: function() {
        wx.stopBackgroundAudio();
        var t = this.data.detailIndex;
        t -= 1, this.setData({
            detailIndex: t,
            voiceCon: !1,
            currentPosition: 0,
            cuo1: !1,
            cuo2: !1,
            cuo3: !1,
            cuo4: !1
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
            isPlayingMusic: !1,
            playing: !0
        });
    },
    Recordingend: function() {
        debugger
        var t = this;
        console.log("录音结束"), o.stop(), this.setData({
            playing: !1
        }), o.onStop(function(a) {
            console.log("recorder stop", a);
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
                            console.log(t), console.log("结果");
                        }
                    });
                    var c = [ e, o ];
                    wx.setStorageSync(n, c), t.getStorage(), t.setData({
                        savedFilePath: e
                    });
                }
            });
        }), wx.hideToast(), o.onError(function(t) {
            console.log("错误信息"), wx.getSetting({
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
        debugger
        var t = this.data.oid, a = this.data.detailIndex, e = this.data.oraleDetail;
        this.getBackStatus(), this.setData({
            startPlay: !1,
            isPlayingMusic: !1,
            selectedAns: !1
        }), e[a + 1] ? e[a - 1] ? this.setData({
            previousSty: !0,
            nextSty: !0,
            completeSty: !1
        }) : this.setData({
            previousSty: !1,
            completeSty: !1
        }) : this.setData({
            nextSty: !1,
            completeSty: !1
        });
        debugger
        var o = this.data.type + "voice" + t + a;
        console.log(o);
        var s = wx.getStorageSync(o);
        s && 4 == a && this.setData({
            completeSty: !0,
            nextSty: !1
        }), e[a].typeof ? this.setData({
            datiData: !0,
            yuyinData: !1
        }) : this.setData({
            datiData: !1,
            yuyinData: !0
        }), s ? this.setData({
            nextSty: !0,
            voiceCon: !0
        }) : this.setData({
            nextSty: !1,
            completeSty: !1
        }), a > 2 && this.setData({
            nextSty: !1,
            completeSty: !1
        });
    },
    playVoice: function() {
        this.data.savedFilePath;
        console.log(this.data.type);
        var t = this.data.type + "voice" + this.data.oid + this.data.detailIndex, a = wx.getStorageSync(t);
        e.src = a[0];
        var o = a[1], s = this;
        console.log(a), this.data.startPlay ? (e.pause(), this.setData({
            startPlay: !1
        })) : (e.play(), this.setData({
            startPlay: !0
        })), setTimeout(function() {
            s.setData({
                startPlay: !1,
                playing: !1
            });
        }, o + 500);
    },
    getBackStatus: function() {
        console.log("getBackStatus");
        var t = this.data.oraleDetail, e = this.data.detailIndex, o = this;
        console.log(t[e].oralesound), t[e].oralesound && (a.src = t[e].oralesound, a.stop(),
        a.src = t[e].oralesound, a.title = "今日重点", a.onPlay(function() {
            wx.hideNavigationBarLoading(), a.pause();
            var t = setInterval(function() {
                var e = a.duration;
                e && 0 != e && (o.setData({
                    audioMax: e
                }), clearInterval(t));
            }, 1e3);
        }));
    },
    startPlay: function() {
        var t = this, e = this.data.isPlayingMusic, o = this.data.oraleDetail, s = this.data.detailIndex;
        console.log(o[s].oralesound), e ? (a.pause(), this.setData({
            isPlayingMusic: !1
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
                a.paused && clearInterval(e), console.log(n), 0 != n && 1 != n || (t.setData({
                    isPlayingMusic: !1,
                    currentPosition: 0
                }), clearInterval(e), a.stop());
            }, 1e3);
        }), this.setData({
            isPlayingMusic: !0
        }));
    },
    sliderchange: function(t) {
        console.log(t), wx.seekBackgroundAudio({
            position: t.detail.value
        });
    },
    optcs1: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo1: !0
        });
    },
    optcs2: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo2: !0
        });
    },
    optcs3: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo3: !0
        });
    },
    optcs4: function(t) {
        t != this.data.oraleDetail[this.data.detailIndex].copt && this.setData({
            cuo4: !0
        });
    },
    subAnsTap: function(t) {
        console.log(t);
        var a = this.data.oraleDetail, e = this.data.detailIndex, o = t.currentTarget.dataset.number;
        1 == a[e].copt && this.setData({
            cuo1: !0
        }), 2 == a[e].copt && this.setData({
            cuo2: !0
        }), 3 == a[e].copt && this.setData({
            cuo3: !0
        }), 4 == a[e].copt && this.setData({
            cuo4: !0
        }), 1 == o && this.optcs1(o), 2 == o && this.optcs2(o), 3 == o && this.optcs3(o), 
        4 == o && this.optcs4(o), 4 == e && this.setData({
            completeSty: !0,
            nextSty: !1
        }), this.setData({
            selectedAns: !0,
            nextSty: !0
        });
    },
    onHide: function() {
        wx.stopBackgroundAudio();
    }
});