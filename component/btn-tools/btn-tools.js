Component({
    properties: {
        innerText: {
            type: String,
            value: "default value"
        }
    },
    data: {
        isclick: !1,
        animationData: {},
        animationDatawrap: {},
        animationData1: {},
        animationData2: {},
        animationData3: {},
        animationData4: {},
        appAD: {
            appId: "",
            path: "",
            extra: "",
            version: ""
        }
    },
    attached: function() {
        var t = this;
        wx.request({
            url: "https://api.xdooi.com/mpjump",
            data: {},
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                t.setData({
                    appAD: a.data
                });
            }
        });
    },
    methods: {
        cancelmove: function(t) {
            console.log(t);
        },
        ani_show: function() {
            var t = this, a = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animation = a, a.scale(0, 0).step(), this.setData({
                animationData: a.export()
            });
            var i = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animationwrap = i, i.scale(1, 1).step(), this.setData({
                animationDatawrap: i.export()
            });
            var n = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animation1 = n, n.translate(-45, 0).step().translate(-90, 0).step().translate(-135, 0).step().translate(-180, 0).step(), 
            setTimeout(function() {
                t.setData({
                    animationData1: n.export()
                });
            }, 300);
            var e = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animation2 = e, e.translate(-45, 0).step().translate(-90, 0).step().translate(-135, 0).step(), 
            setTimeout(function() {
                t.setData({
                    animationData2: e.export()
                });
            }, 600);
            var s = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animation3 = s, s.translate(-45, 0).step().translate(-90, 0).step(), setTimeout(function() {
                t.setData({
                    animationData3: s.export()
                });
            }, 900);
            var o = wx.createAnimation({
                duration: 300,
                timingFunction: "ease"
            });
            this.animation4 = o, o.translate(-45, 0).step(), setTimeout(function() {
                t.setData({
                    animationData4: o.export()
                });
            }, 1200);
        },
        ani_hide: function() {
            var t = this;
            if (!this.isclick) {
                this.animation1.translate(-135, 0).step().translate(-90, 0).step().translate(-45, 0).step().translate(0, 0).step(), 
                this.setData({
                    animationData1: this.animation1.export(),
                    isclick: !0
                }), this.animation2.translate(-90, 0).step().translate(-45, 0).step().translate(0, 0).step(), 
                setTimeout(function() {
                    t.setData({
                        animationData2: t.animation2.export()
                    });
                }, 300), this.animation3.translate(-45, 0).step().translate(0, 0).step(), setTimeout(function() {
                    t.setData({
                        animationData3: t.animation3.export()
                    });
                }, 600), this.animation4.translate(0, 0).step(), setTimeout(function() {
                    t.setData({
                        animationData4: t.animation4.export()
                    });
                }, 900), this.animationwrap.scale(0, 0).step(), this.animation.scale(1, 1).step(), 
                setTimeout(function() {
                    t.setData({
                        animationData: t.animation.export(),
                        animationDatawrap: t.animationwrap.export(),
                        isclick: !1
                    });
                    var a = {}, i = {};
                    t.triggerEvent("hideBg", a, i);
                }, 1200);
            }
        }
    }
});