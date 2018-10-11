var e = getApp(), t = function(e) {
    var t = wx.getStorageSync("dknum") || 0, a = wx.getStorageSync("dkday"), o = function() {
        var e = new Date();
        return e.getFullYear() + "" + (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : "" + (e.getMonth() + 1)) + (e.getDate() < 10 ? "0" + e.getDate() : "" + e.getDate());
    };
    if (a) if (a != o()) {
        var s = parseInt(t) + 1;
        wx.setStorageSync("dknum", s), wx.setStorageSync("dkday", o());
    } else console.log("has dk le"); else wx.setStorageSync("dknum", 1), wx.setStorageSync("dkday", o());
    var l = wx.getStorageSync("showpageimg");
    console.log("saved", l);
    var n = wx.getStorageSync("showpageicon"), i = wx.getStorageSync("showpageusericon"), r = wx.getStorageSync("showpageduyy"), g = .9 * wx.getSystemInfoSync().windowWidth, c = 440 * g / 300;
    e.setData({
        canvasWidth: g,
        canvasHeight: c,
        showbg: !0
    });
    var f = wx.createCanvasContext("sharepage");
    f.setFillStyle("rgba(0,0,0,0)"), f.fillRect(0, 0, g, c), f.save(), f.setFillStyle("#000"), 
    function(e, t, a, o, s, l) {
        e.beginPath(), e.arc(t + l, a + l, l, Math.PI, 3 * Math.PI / 2), e.lineTo(o - l + t, a), 
        e.arc(o - l + t, l + a, l, 3 * Math.PI / 2, 2 * Math.PI), e.lineTo(o + t, s + a), 
        e.lineTo(t, s + a), e.closePath(), e.fill(), e.clip();
    }(f, 0, 0, g, .45 * c, 8), f.drawImage(l, 0, 0, g, .45 * c), f.restore(), f.save(), 
    f.setFillStyle("#fff"), function(e, t, a, o, s, l) {
        e.beginPath(), e.lineTo(t, a), e.lineTo(t + o, a), e.lineTo(o + t, s + a - l), e.arc(o - l + t, s - l + a, l, 0, 1 * Math.PI / 2), 
        e.lineTo(l + t, s + a), e.arc(l + t, s - l + a, l, 1 * Math.PI / 2, Math.PI), e.closePath(), 
        e.fill(), e.clip();
    }(f, 0, .45 * c, g, .55 * c, 8), f.restore(), f.save(), f.setFillStyle("#fff"), 
    f.drawImage(n, 20, .45 * c + 23, 20, 20, 30, 30), f.restore();
    f.save(), f.font = "17px helvetica", f.fillStyle = "#666", f.fillText(function() {
        var e = new Date();
        return (e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : "" + (e.getMonth() + 1)) + "月" + (e.getDate() < 10 ? "0" + e.getDate() : "" + e.getDate()) + "日";
    }(), 46, .45 * c + 40), f.restore(), f.save();
    f.font = "16px helvetica", f.fillStyle = "#666";
    var h = f.measureText("天");
    f.fillText("天", g - 20 - h.width, .45 * c + 40), f.restore(), f.save();
    var d = " " + wx.getStorageSync("dknum") + " ";
    f.font = "bold 26px helvetica", f.fillStyle = "#6666FF";
    var w = f.measureText(d);
    f.fillText(d, g - 20 - w.width - h.width, .45 * c + 43), f.restore(), f.save();
    f.font = "16px helvetica", f.fillStyle = "#666";
    var x = f.measureText("累计阅读");
    f.fillText("累计阅读", g - 20 - x.width - w.width - h.width, .45 * c + 40), f.restore(), 
    f.save(), f.setFillStyle("#fff"), f.beginPath(), f.arc(g - 20 - 40 + 15 - x.width - w.width - h.width, .45 * c + 40 - 7, 15, 0, 2 * Math.PI, !1), 
    f.closePath(), f.fill(), f.clip(), f.drawImage(i, g - 20 - 40 - x.width - w.width - h.width, .45 * c + 18, 30, 30), 
    f.restore(), f.save(), f.moveTo(20, .45 * c + 60), f.lineTo(g - 20, .45 * c + 60), 
    f.setStrokeStyle("#ddd"), f.stroke(), f.restore(), f.save();
    var v = e.data.slogan.english;
    console.log(v);
    var u = e.data.slogan.chinese, S = g - 40, y = 23, m = 0, p = 0;
    f.font = "16px helvetica", f.fillStyle = "#666";
    for (var T = v.split(" "), I = T.length, k = "", P = 0; P < I; P++) if (p += f.measureText(T[P] + " ").width, 
    k += T[P] + " ", T[P + 1] && p + f.measureText(T[P + 1]).width > S && (f.fillText(k, 20, .45 * c + 70 + y), 
    y += 23, p = 0, k = "", m = P), P == I - 1) {
        var b = "";
        T && T.map(function(e, t) {
            (!m || t > m && e.length > 0) && (b += e + " ");
        }), b.length > 0 && f.fillText(b, 20, .45 * c + 70 + y);
    }
    f.restore(), f.save(), f.font = "14px helvetica", f.fillStyle = "#999";
    for (var M = g - 44, D = 0, F = 0, C = 0; C < u.length; C++) (F += f.measureText(u[C]).width) > M && (f.fillText(u.substring(D, C), 20, .45 * c + 100 + y), 
    y += 23, F = 0, D = C), C == u.length - 1 && f.fillText(u.substring(D, C + 1), 20, .45 * c + 100 + y);
    f.restore();
    var U = .55 * c - 100 - y, j = "每日du英语:学习是自己的事!";
    f.save(), f.font = "12px helvetica", f.fillStyle = "#999", U > 60 && U < 90 ? (f.fillText(j, 20, c - 38), 
    f.moveTo(20, c - 32), f.lineTo(20 + f.measureText(j).width, c - 32)) : U > 90 ? (f.fillText(j, 20, c - 48), 
    f.moveTo(20, c - 42), f.lineTo(20 + f.measureText(j).width, c - 42)) : U < 30 || (f.fillText(j, 20, c - 18), 
    f.moveTo(20, c - 12), f.lineTo(20 + f.measureText(j).width, c - 12)), f.setStrokeStyle("#ddd"), 
    f.stroke(), f.restore(), U > 84 && U <= 105 ? (console.log("84-105"), f.save(), 
    f.setFillStyle("#fff"), f.drawImage(r, g - 84, c - 84, 75, 75, 75, 75), f.restore()) : U > 60 && U <= 84 ? (console.log("50-84"), 
    f.save(), f.setFillStyle("#fff"), f.drawImage(r, g - 70, c - 70, 60, 60, 60, 60), 
    f.restore()) : U > 105 && (console.log("105+"), f.save(), f.setFillStyle("#fff"), 
    f.drawImage(r, g - 105, c - 105, 90, 90, 90, 90), f.restore()), f.draw(), wx.hideLoading();
};

module.exports = {
    tosavePic: function(a) {
        if (wx.getStorageSync("showpageusericon")) t(a, wx.getStorageSync("showpageusericon")); else {
            var o = function(e) {
                wx.getImageInfo({
                    src: e.avatarUrl || "https://dev.xdooi.com/images/du.png",
                    success: function(e) {
                        wx.setStorage({
                            key: "showpageusericon",
                            data: e.path
                        }), t(a, e.path);
                    }
                });
            };
            e.globalData.userInfo ? o(e.globalData.userInfo) : a.data.canIUse ? e.userInfoReadyCallback = function(e) {
                o(e.userInfo);
            } : wx.getUserInfo({
                success: function(e) {
                    o(e.userInfo);
                }
            });
        }
    },
    save: function() {
        wx.getImageInfo({
            src: "https://dev.xdooi.com/bingimage/bgTop.jpg",
            success: function(e) {
                console.log("save bgim"), wx.setStorage({
                    key: "showpageimg",
                    data: e.path
                });
            }
        }), wx.getImageInfo({
            src: "https://dev.xdooi.com/images/rlicon.png",
            success: function(e) {
                wx.setStorage({
                    key: "showpageicon",
                    data: e.path
                });
            }
        }), wx.getImageInfo({
            src: "https://dev.xdooi.com/images/englishdu.jpg",
            success: function(e) {
                wx.setStorage({
                    key: "showpageduyy",
                    data: e.path
                });
            }
        });
    }
};