var t, a = getApp(), s = a.globalData.backgroundAudioManager;

require("../../utils/util.js");

Component({
    properties: {
        src: {
            type: String,
            value: ""
        },
        current_poem_url: {
            type: String,
            value: "",
            observer: function(t) {
                t === this.data.src ? this.setData({
                    percent: 0,
                    first_play: !0
                }) : this.setData({
                    playing: !1,
                    percent: 0
                });
            }
        },
        width: Number,
        poem: Object,
        play: {
            type: String,
            value: "",
            observer: function(t) {
                t === this.data.src && (this.setData({
                    first_play: !0,
                    status: "play"
                }), this.control());
            }
        },
        auto: {
            type: Boolean,
            value: !1,
            observer: function(t) {
                if (t) {
                    var a = {
                        currentTarget: {
                            dataset: {
                                status: "play"
                            }
                        }
                    };
                    this.setStatus(a);
                }
            }
        }
    },
    data: {
        playing: !1,
        percent: 0,
        first_play: !0,
        status: ""
    },
    attached: function() {},
    methods: {
        setStatus: function(t) {
            var a = this;
            this.setData({
                status: t.currentTarget.dataset.status
            }), console.log(this.data.status), setTimeout(function() {
                a.control();
            }, 100);
        },
        control: function() {
            var e = this;
            "play" !== this.data.status || this.data.first_play || "onEnded" != a.globalData.status || (s.src = this.data.src, 
            this.setData({
                playing: !0
            }), s.play()), this.data.current_poem_url != this.data.src && (a.globalData.status = "onStop"), 
            0 !== this.data.src.length ? ("pause" !== this.data.status || this.data.first_play || (a.globalData.status = "pause", 
            s.pause(), this.setData({
                playing: !1
            })), this.data.first_play && (clearInterval(t), s.title = this.data.poem.poetry_name, 
            s.epname = this.data.poem.poetry_name, s.singer = this.data.poem.nickname, s.coverImgUrl = this.data.poem.headimgurl, 
            s.src = this.data.src, this.setData({
                playing: !0,
                percent: 0
            }), a.globalData.status = "play"), "play" !== this.data.status || this.data.first_play || (a.globalData.status = "play", 
            this.setData({
                playing: !0
            }), s.play()), console.log(a.globalData.status), this.progress(), t = setInterval(function() {
                e.progress();
            }, 1e3), setTimeout(function() {
                e.setData({
                    first_play: !1
                });
            }, 1e3)) : wx.showToast({
                title: "请选择歌曲",
                icon: "none"
            });
        },
        progress: function() {
            "onEnded" === a.globalData.status && (clearInterval(t), this.setData({
                playing: !1,
                percent: 100
            })), "pause" === a.globalData.status && this.setData({
                playing: !1
            }), "play" === a.globalData.status && this.data.current_poem_url == this.data.src && this.setData({
                playing: !0
            }), "onStop" === a.globalData.status && (this.setData({
                playing: !1,
                percent: 0
            }), clearInterval(t)), this.data.playing && (s.duration > 0 && !this.data.first_play && s.currentTime > 0 ? this.setData({
                percent: Number((s.currentTime / s.duration * 100).toFixed(2))
            }) : this.setData({
                percent: 0
            }));
        }
    }
});