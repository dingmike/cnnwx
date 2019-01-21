var api = require('../config/api.js');

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * ts: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function tsFormatTime(timestamp, format) {

    const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    let returnArr = [];

    let date = new Date(timestamp);
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    returnArr.push(year, month, day, hour, minute, second);

    returnArr = returnArr.map(formatNumber);

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;

}


function translateTime(e, n) {
    n = n / 1000;
    var r = n ? new Date(1000 * n) : new Date();
    var a = function (t, e) {
            return (t += "").length < e ? new Array(++e - t.length).join("0") + t : t;
        }, u = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], o = {
            1: "st",
            2: "nd",
            3: "rd",
            21: "st",
            22: "nd",
            23: "rd",
            31: "st"
        },
        i = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        c = {
            d: function () {
                return a(c.j(), 2);
            },
            D: function () {
                return c.l().substr(0, 3);
            },
            j: function () {
                return r.getDate();
            },
            l: function () {
                return u[c.w()];
            },
            N: function () {
                return c.w() + 1;
            },
            S: function () {
                return o[c.j()] ? o[c.j()] : "th";
            },
            w: function () {
                return r.getDay();
            },
            z: function () {
                return (r - new Date(r.getFullYear() + "/1/1")) / 864e5 >> 0;
            },
            W: function () {
                var e, n = c.z(), a = 364 + c.L() - n, u = (new Date(r.getFullYear() + "/1/1").getDay() || 7) - 1;
                return a <= 2 && (r.getDay() || 7) - 1 <= 2 - a ? 1 : n <= 2 && u >= 4 && n >= 6 - u ? (e = new Date(r.getFullYear() - 1 + "/12/31"),
                    t("W", Math.round(e.getTime() / 1e3))) : 1 + (u <= 3 ? (n + u) / 7 : (n - (7 - u)) / 7) >> 0;
            },
            F: function () {
                return i[c.n()];
            },
            m: function () {
                return a(c.n(), 2);
            },
            M: function () {
                return c.F().substr(0, 3);
            },
            n: function () {
                return r.getMonth() + 1;
            },
            t: function () {
                var t;
                return 2 == (t = r.getMonth() + 1) ? 28 + c.L() : 1 & t && t < 8 || !(1 & t) && t > 7 ? 31 : 30;
            },
            L: function () {
                var t = c.Y();
                return 3 & t || !(t % 100) && t % 400 ? 0 : 1;
            },
            Y: function () {
                return r.getFullYear();
            },
            y: function () {
                return (r.getFullYear() + "").slice(2);
            },
            a: function () {
                return r.getHours() > 11 ? "pm" : "am";
            },
            A: function () {
                return c.a().toUpperCase();
            },
            B: function () {
                var t = 60 * (r.getTimezoneOffset() + 60),
                    e = 3600 * r.getHours() + 60 * r.getMinutes() + r.getSeconds() + t, n = Math.floor(e / 86.4);
                return n > 1e3 && (n -= 1e3), n < 0 && (n += 1e3), 1 == String(n).length && (n = "00" + n),
                2 == String(n).length && (n = "0" + n), n;
            },
            g: function () {
                return r.getHours() % 12 || 12;
            },
            G: function () {
                return r.getHours();
            },
            h: function () {
                return a(c.g(), 2);
            },
            H: function () {
                return a(r.getHours(), 2);
            },
            i: function () {
                return a(r.getMinutes(), 2);
            },
            s: function () {
                return a(r.getSeconds(), 2);
            },
            O: function () {
                var t = a(Math.abs(r.getTimezoneOffset() / 60 * 100), 4);
                return t = r.getTimezoneOffset() > 0 ? "-" + t : "+" + t;
            },
            P: function () {
                var t = c.O();
                return t.substr(0, 3) + ":" + t.substr(3, 2);
            },
            c: function () {
                return c.Y() + "-" + c.m() + "-" + c.d() + "T" + c.h() + ":" + c.i() + ":" + c.s() + c.P();
            },
            U: function () {
                return Math.round(r.getTime() / 1e3);
            }
        };
    return e.replace(/[\\]?([a-zA-Z])/g, function (t, e) {
        return t != e ? e : c[e] ? c[e]() : e;
    });
}


function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 封微信的request
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function (res) {
                console.log("success");
                if (res.statusCode == 200) {
                    // resolve(res.data);
                    if (res.data.errno == 401) {
                        //需要登录后才可以操作
                        wx.removeStorageSync("userInfo");
                        wx.removeStorageSync("openid");
                        wx.removeStorageSync("token");
                   /*     wx.navigateTo({
                            url: '/pages/firstAuth/firstAuth'
                        });*/
                        wx.redirectTo({
                            url: '/pages/firstAuth/firstAuth'
                            // url: '/pages/rank/rank'
                        });
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
                console.log("failed")
            }
        })
    });
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

// 普通用户是否登录
function redirect(url) {
    //判断页面是否需要登录 暂时不适用
   /* if (checkSession()) {
        wx.redirectTo({
            url: '/pages/firstAuth/firstAuth'
        });
        return false;
    } else {
        wx.navigateTo({
            url: url
        });
    }*/
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}

function showSuccessToast(msg) {
    wx.showToast({
        title: msg,
    })
}
// 验证手机号
function validatemobile(mobile) {
    let mobileLength = mobile.length;
    if (mobileLength == 0) {
        showErrorToast('请输入手机号');
        return false;
    }
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
        showErrorToast('手机号有误');
        return false;
    }
    if (mobileLength != 11) {
       /* wx.showToast({
            title: '手机号长度有误！',
            icon: 'success',
            duration: 1500
        });*/
        showErrorToast('手机号长度有误');
        return false;
    }
    return true;
}

module.exports = {
    validatemobile,
    formatTime,
    tsFormatTime,
    translateTime,
    request,
    redirect,
    showErrorToast,
    showSuccessToast,
    checkSession,
    login
};


