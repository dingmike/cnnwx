function t(e, n) {
    var r = n ? new Date(1e3 * n) : new Date(), a = function(t, e) {
        return (t += "").length < e ? new Array(++e - t.length).join("0") + t : t;
    }, u = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], o = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    }, i = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], c = {
        d: function() {
            return a(c.j(), 2);
        },
        D: function() {
            return c.l().substr(0, 3);
        },
        j: function() {
            return r.getDate();
        },
        l: function() {
            return u[c.w()];
        },
        N: function() {
            return c.w() + 1;
        },
        S: function() {
            return o[c.j()] ? o[c.j()] : "th";
        },
        w: function() {
            return r.getDay();
        },
        z: function() {
            return (r - new Date(r.getFullYear() + "/1/1")) / 864e5 >> 0;
        },
        W: function() {
            var e, n = c.z(), a = 364 + c.L() - n, u = (new Date(r.getFullYear() + "/1/1").getDay() || 7) - 1;
            return a <= 2 && (r.getDay() || 7) - 1 <= 2 - a ? 1 : n <= 2 && u >= 4 && n >= 6 - u ? (e = new Date(r.getFullYear() - 1 + "/12/31"), 
            t("W", Math.round(e.getTime() / 1e3))) : 1 + (u <= 3 ? (n + u) / 7 : (n - (7 - u)) / 7) >> 0;
        },
        F: function() {
            return i[c.n()];
        },
        m: function() {
            return a(c.n(), 2);
        },
        M: function() {
            return c.F().substr(0, 3);
        },
        n: function() {
            return r.getMonth() + 1;
        },
        t: function() {
            var t;
            return 2 == (t = r.getMonth() + 1) ? 28 + c.L() : 1 & t && t < 8 || !(1 & t) && t > 7 ? 31 : 30;
        },
        L: function() {
            var t = c.Y();
            return 3 & t || !(t % 100) && t % 400 ? 0 : 1;
        },
        Y: function() {
            return r.getFullYear();
        },
        y: function() {
            return (r.getFullYear() + "").slice(2);
        },
        a: function() {
            return r.getHours() > 11 ? "pm" : "am";
        },
        A: function() {
            return c.a().toUpperCase();
        },
        B: function() {
            var t = 60 * (r.getTimezoneOffset() + 60), e = 3600 * r.getHours() + 60 * r.getMinutes() + r.getSeconds() + t, n = Math.floor(e / 86.4);
            return n > 1e3 && (n -= 1e3), n < 0 && (n += 1e3), 1 == String(n).length && (n = "00" + n), 
            2 == String(n).length && (n = "0" + n), n;
        },
        g: function() {
            return r.getHours() % 12 || 12;
        },
        G: function() {
            return r.getHours();
        },
        h: function() {
            return a(c.g(), 2);
        },
        H: function() {
            return a(r.getHours(), 2);
        },
        i: function() {
            return a(r.getMinutes(), 2);
        },
        s: function() {
            return a(r.getSeconds(), 2);
        },
        O: function() {
            var t = a(Math.abs(r.getTimezoneOffset() / 60 * 100), 4);
            return t = r.getTimezoneOffset() > 0 ? "-" + t : "+" + t;
        },
        P: function() {
            var t = c.O();
            return t.substr(0, 3) + ":" + t.substr(3, 2);
        },
        c: function() {
            return c.Y() + "-" + c.m() + "-" + c.d() + "T" + c.h() + ":" + c.i() + ":" + c.s() + c.P();
        },
        U: function() {
            return Math.round(r.getTime() / 1e3);
        }
    };
    return e.replace(/[\\]?([a-zA-Z])/g, function(t, e) {
        return t != e ? e : c[e] ? c[e]() : e;
    });
}

var e = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var e = new Date(), n = e.getFullYear(), r = e.getMonth() + 1, a = n + "-" + r;
        this.setData({
            date: a
        }), this.setData({
            choiceYear: n,
            choiceMonth: r
        }), this.getCardRecord();
    },
    getCardRecord: function() {
        var n = e.globalData.openid, r = this;
        wx.request({
            url: e.globalData.url + "api/User/getCardRecord",
            data: {
                uid: n
            },
            success: function(e) {
                var n = e.data;
                console.log(n), console.log("数据");
                for (var a = 0; a < n.length; a++) n[a].card_time = t("Y-m-d H:i:s", n[a].card_time);
                console.log(n), r.setData({
                    cardData: n
                }), r.processingData(n);
            }
        });
    },
    bindDateChange: function(t) {
        console.log("picker发送选择改变，携带值为", t.detail.value);
        var e = t.detail.value.substr(0, 4), n = t.detail.value.substr(5, 2);
        this.setData({
            date: t.detail.value,
            choiceYear: e,
            choiceMonth: n
        }), this.processingData();
    },
    processingData: function() {
        for (var t = this.data.cardData, e = this.data.choiceYear, n = this.data.choiceMonth, r = new Object(), a = 0, u = 0; u < t.length; u++) t[u].month == n && t[u].year == e && (r[a] = t[u], 
        a++);
        console.log(r), 0 == Object.keys(r).length ? (console.log("判空成立"), this.setData({
            showDatasNull: !0
        })) : this.setData({
            showDatasNull: !1
        }), this.setData({
            showData: r
        });
    },
    onReady: function() {},
    onShow: function() {},
    onShareAppMessage: function() {}
});