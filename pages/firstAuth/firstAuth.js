
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: "",
        userData:'',
        ldata: true,
        showModal: false,
        showModalStatus: false
        // userInfo: {},
    },
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
    },
    util: function(currentStatu){
        /* 动画部分 */
        // 第1步：创建动画实例
        var animation = wx.createAnimation({
            duration: 200,  //动画时长
            timingFunction: "linear", //线性
            delay: 0  //0则不延迟
        });

        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

            //关闭
            if (currentStatu == "close") {
                this.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)

        // 显示
        if (currentStatu == "open") {
            this.setData(
                {
                    showModalStatus: true
                }
            );
        }
    },
    onReady: function () {

    },
    onLoad: function(e) {
        // 页面渲染完成
       /* if(app.globalData.userInfo){
            wx.redirectTo({
                url: "/pages/gongDu/gongDu"
            });
        }*/
    },
    /*getuserauth: function() {
        var n = this;
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(t) {
                        n.setData({
                            userInfo: t.userInfo
                        }), app.globalData.userInfo = t.userInfo, wx.reLaunch({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },*/
    bindGetUserInfo(e) {
        this.setData({
            userData: e.detail
        });
        if (e.detail.userInfo){
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.data.userInfo
                });
                app.globalData.userInfo = res.data.userInfo;
                // wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync("openid",res.data.userInfo.weixin_openid);
                wx.setStorageSync("token",res.data.token);
                app.globalData.openid = res.data.userInfo.weixin_openid;
                app.globalData.token = res.data.token;
                debugger
                wx.navigateBack({ delta: 1 });
            }).catch((err) => {
                console.log(err)
            });
        } else {
            // this.setData({ldata: false});
            //用户按了拒绝按钮
            wx.showModal({
                title: '用户未授权',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success:  (res) => {

                    if (res.confirm) {
                       /* this.setData({
                            showModal: true,
                            showModalStatus: true,

                        })*/

                       /* wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    user.loginByWeixin(e.detail).then(res => {
                                        this.setData({
                                            userInfo: res.data.userInfo
                                        });
                                        app.globalData.userInfo = res.data.userInfo;
                                        wx.setStorageSync('userInfo', res.data.userInfo);
                                        app.globalData.token = res.data.token;
                                        /!*wx.redirectTo({
                                            url: "/pages/gongDu/gongDu"
                                        });*!/
                                        wx.navigateBack({ changed: true });
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })*/
                    }else{

                       /* this.setData({
                            showModal: false,
                            ldata: true,
                            showModalStatus: false,

                        })*/
                    }
                }
            });
        }
    },
    reAuthUser(typeResponse){
        this.setData({
            showModal: false,
            showModalStatus: false
        })
        wx.getUserInfo({
            success:  (res)=> {
                if( typeResponse.detail.authSetting["scope.userInfo"]){
                    user.loginByWeixin(res).then(res => {
                        this.setData({
                            userInfo: res.data.userInfo
                        });
                        app.globalData.userInfo = res.data.userInfo;
                        wx.setStorageSync('userInfo', res.data.userInfo);
                        wx.setStorageSync("openid",res.data.userInfo.weixin_openid);
                        app.globalData.openid = res.data.userInfo.weixin_openid;
                        app.globalData.token = res.data.token;
                        setTimeout(function(){
                            /*wx.redirectTo({
                                url: "/pages/gongDu/gongDu"
                            });*/
                            wx.navigateBack({ changed: true });
                        },1500)

                    }).catch((err) => {
                        console.log(err)
                    });
                }
            },
            fail: function(err){
                console.log(err)
            }
        })

    }
});