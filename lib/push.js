function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = function() {
    function e(e, t) {
        for (var a = 0; a < t.length; a++) {
            var o = t[a];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
            Object.defineProperty(e, o.key, o);
        }
    }
    return function(t, a, o) {
        return a && e(t.prototype, a), o && e(t, o), t;
    };
}(), a = function() {
    function a(t) {
        e(this, a), this.appId = t.appId, this.secretId = t.secretId, this.templateId = t.templateId, 
        this.data = t.data, this.page = t.page;
    }
    return t(a, [ {
        key: "add",
        value: function(e) {
            var t = this, a = e.detail.e.detail.formId;
            if ("the formId is a mock one" === a) return console.log("本地环境不支持发送push");
            wx.login({
                success: function(e) {
                    wx.request({
                        method: "POST",
                        url: "https://one.xdooi.com/push/add_formId/",
                        data: {
                            code: e.code,
                            appId: t.appId,
                            secret: t.secretId,
                            formId: a,
                            template_id: t.templateId,
                            page: t.page,
                            data: t.data
                        },
                        success: function(e) {
                            console.log(e.data);
                        },
                        fail: function(e) {
                            console.log(e);
                        }
                    });
                }
            });
        }
    } ]), a;
}();

exports.default = a;