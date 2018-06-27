var t = getApp(), a = require("../../utils/util.js"), e = wx.getRecorderManager();

Page({
    data: {
        REC: !1,
        countDown: "00:00",
        poem: "",
        uid: "",
        share: "",
        poem_id: "",
        count: "",
        stop: "",
        lock: "",
        checkScope: "",
        recorderManager: "",
        setInterval: ""
    },
    onLoad: function(t) {
        t.id && this.setData({
            poem_id: t.id
        });
        var e = this.getData;
        a.checkSession(e);
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        console.log("onShow"), this.setData({
            checkScope: !1
        }), wx.getSetting({
            success: function(t) {
                t.authSetting.hasOwnProperty("scope.record") && !t.authSetting["scope.record"] && a.checkScope();
            }
        }), this.setData({
            stop: !1,
            lock: !1,
            count: 0
        }), t.globalData.backgroundAudioManager.stop(), wx.onAccelerometerChange(function(t) {
            (t.x > 1 || t.y > 1) && a.shake();
        }), e.onError(function(t) {
            console.log(t), clearInterval(a.data.setInterval), a.setData({
                REC: !1,
                count: 0
            }), wx.getSetting({
                success: function(t) {
                    t.authSetting.hasOwnProperty("scope.record") && t.authSetting["scope.record"] || a.checkScope();
                }
            });
        }), e.onStart(function() {
            console.log("录音开始"), a.setData({
                setInterval: a.countDown()
            });
        }), e.onStop(function(t) {
            clearInterval(a.data.setInterval), a.uploadFile(t.tempFilePath), a.setData({
                count: 0,
                REC: !1,
                stop: !0
            });
        }), console.log(this.data.count);
    },
    onHide: function() {
        console.log("onHide"), clearInterval(this.data.setInterval), this.setData({
            count: 0
        }), e.stop(), console.log(this.data.count), wx.stopAccelerometer();
    },
    onUnload: function() {
        clearInterval(this.data.setInterval), this.setData({
            count: 0
        }), e.stop(), wx.stopAccelerometer();
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: this.data.share.share_title,
            imageUrl: this.data.share.share_img,
            path: "pages/index/index?uid=" + this.data.uid
        };
    },
    record: function(t) {
        if (!this.data.lock) {
            var a = Number(t.currentTarget.dataset.status);
            0 == a && this.data.count < 9 ? wx.showToast({
                title: "录音时间必须超过十秒哦",
                icon: "none"
            }) : (1 == a && (this.setData({
                REC: !0
            }), e.start({
                format: "mp3",
                duration: 12e4
            })), 0 == a && this.data.count > 10 && (this.setData({
                REC: !1
            }), e.stop(), this.setData({
                stop: !0
            })));
        }
    },
    countDown: function() {
        var t = this;
        this.setData({
            count: 0
        });
        var a = setInterval(function() {
            if (t.data.count >= 120 || t.data.stop) return t.setData({
                count: 0,
                REC: !1
            }), console.log(t.data.count), clearInterval(a), void e.stop();
            t.setData({
                count: ++t.data.count
            }), t.data.count < 10 ? t.setData({
                countDown: "00:0" + t.data.count
            }) : t.setData({
                countDown: "00:" + t.data.count
            });
        }, 1e3);
        return a;
    },
    shake: function() {
        var t = this;
        this.data.lock || (this.setData({
            lock: !0
        }), wx.vibrateLong(), setTimeout(function() {
            t.setData({
                lock: !1
            });
        }, 2e3), this.setData({
            poem_id: ""
        }), this.getData());
    },
    getData: function(e) {
        var o = this, n = t.globalData.url + "/index.php?m=Mini&c=Poetry&a=poetry_preadd&poetry_id=" + this.data.poem_id, s = {};
        a.request_post(n, s, function(t) {
            o.setData({
                uid: t.data.uid,
                share: t.data.share,
                poem: t.data.poetry,
                poem_id: t.data.poetry.id
            });
        }, 0);
    },
    navigateTo: function(t) {
        a.navigateTo(t);
    },
    uploadFile: function(a) {
        var e = this;
        console.log(this.data.REC, this.data.count), this.data.REC && 120 != this.data.count && 119 != this.data.count || (this.setData({
            lock: !0
        }), wx.uploadFile({
            url: "https://ydn.fudai.wuhouweixin.com/index.php?m=Mini&c=Poetry&a=upload",
            filePath: a,
            name: "file",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
                cookie: "loginSession=" + t.globalData.trd_session
            },
            success: function(t) {
                wx.hideLoading(), wx.redirectTo({
                    url: "../addBgm/addBgm?id=" + e.data.poem_id
                });
            }
        }).onProgressUpdate(function(t) {
            wx.showLoading({
                title: "上传中 " + t.progress + "%"
            });
        }));
    },
    checkScope: function() {
        var t = this;
        this.data.checkScope || (this.setData({
            checkScope: !0
        }), wx.showModal({
            title: "温馨提示",
            content: "由于您未授权语音权限，录音失败",
            showCancel: !1,
            cancelText: "前往授权",
            success: function() {
                wx.openSetting({
                    success: function(a) {
                        a.authSetting["scope.record"] || t.checkScope();
                    }
                });
            }
        }));
    }
});