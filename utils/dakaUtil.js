/**
 * Created by admin on 2018/7/4.
 */

var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(e) {
        var r = e.getFullYear(), n = e.getMonth() + 1, a = e.getDate(), s = e.getHours(), o = e.getMinutes(), p = e.getSeconds();
        return [ r, n, a ].map(t).join("/") + " " + [ s, o, p ].map(t).join(":");
    },
    formatSeconds: function(t) {
        var e = parseInt(t), r = 0, n = 0;
        e > 60 && (r = parseInt(e / 60), e = parseInt(e % 60), r > 60 && (n = parseInt(r / 60),
            r = parseInt(r % 60)));
        var a = "" + parseInt(e);
        return r > 0 && (a = parseInt(r) + ":" + a), n > 0 && (a = parseInt(n) + ":" + a),
            a;
    }
};