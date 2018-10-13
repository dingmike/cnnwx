var app = getApp();
// var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        id: 0,
        goods: {},
        new_goods: {},
        gallery: [],
        attribute: [],
        issueList: [],
        comment: [],
        brand: {},
        specificationList: [],
        productList: [],
        relatedGoods: [],
        cartGoodsCount: 0,
        userHasCollect: 0,
        number: 1,
        checkedRetailPrice: 0,
        checkedSpecText: '请选择规格数量',
        checkedSpecImg: '/static/images/cnnNoImg.jpg',
        openAttr: false,
        noCollectImage: "/static/images/icon_collect.png",
        hasCollectImage: "/static/images/icon_collect_checked.png",
        collectBackImage: "/static/images/icon_collect.png",
        $toast: {
            show: false
        }
    },
    getGoodsInfo: function () {
        let that = this;
        util.request(api.GoodsDetail, {id: that.data.id}).then(function (res) {
            if (res.errno === 0) {
                // 防止没有轮播图报错
                if (res.data.gallery.length == 0) {
                    res.data.gallery.push({
                        goods_id: 121212,
                        id: 1,
                        img_desc: "",
                        img_url: "/static/images/cnnNoImg.jpg",
                        sort_order: 5
                    })
                }

                that.setData({
                    goods: res.data.info,
                    gallery: res.data.gallery,
                    attribute: res.data.attribute,
                    issueList: res.data.issue,
                    comment: res.data.comment,
                    brand: res.data.brand,
                    specificationList: res.data.specificationList,
                    checkedSpecImg: res.data.gallery[0].img_url,
                    productList: res.data.productList,
                    userHasCollect: res.data.userHasCollect
                });

                if (res.data.userHasCollect == 1) {
                    that.setData({
                        'collectBackImage': that.data.hasCollectImage
                    });
                } else {
                    that.setData({
                        'collectBackImage': that.data.noCollectImage
                    });
                }
                that.data.new_goods = JSON.parse(JSON.stringify(that.data.goods));
                // WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

                that.getGoodsRelated();

            }
        });

    },
    getGoodsRelated: function () {
        let that = this;
        util.request(api.GoodsRelated, {id: that.data.id}).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    relatedGoods: res.data.goodsList,
                });
            }
        });

    },
    clickSkuValue: function (event) {

        let that = this;
        let specNameId = event.currentTarget.dataset.nameId;
        let specValueId = event.currentTarget.dataset.valueId;

        //判断是否可以点击

        //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
        let _specificationList = this.data.specificationList;
        let _goods = this.data.goods;
        for (let i = 0; i < _specificationList.length; i++) {
            if (_specificationList[i].specification_id == specNameId) {
                for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                    if (_specificationList[i].valueList[j].id == specValueId) {
                        //如果已经选中，则反选
                        if (_specificationList[i].valueList[j].checked) {
                            _specificationList[i].valueList[j].checked = false;
                            //根据已选的值，计算其它值的状态
                            // this.setSpecValueStatus();
                        } else {

                            _specificationList[i].valueList[j].checked = true;

                            // 规格图片
                            if (_specificationList[i].valueList[j].pic_url) {
                                this.setData({
                                    'checkedSpecImg': _specificationList[i].valueList[j].pic_url
                                });
                            }
                            //根据已选的值，计算其它值的状态
                            // this.setSpecValueStatus();
                            this.setDisabledSku(specNameId, specValueId)
                        }
                    } else {
                        _specificationList[i].valueList[j].checked = false;
                        //根据已选的值，计算其它值的状态
                        //  this.setSpecValueStatus();
                    }
                }
            }
        }
        this.setData({
            specificationList: _specificationList
        });
        //重新计算spec改变后的信息
        this.changeSpecInfo();

    },
    //重新计算哪些值不可以点击
    setDisabledSku(specNameId, specValueId){
        Array.prototype.distinct = function () {
            var arr = this,
                result = [],
                i,
                j,
                len = arr.length;
            for (i = 0; i < len; i++) {
                for (j = i + 1; j < len; j++) {
                    if (arr[i] === arr[j]) {
                        j = ++i;
                    }
                }
                result.push(arr[i]);
            }
            return result;
        };
        let _specificationList = this.data.specificationList;
        let _productList = this.data.productList;

        let lastSpecArr = [];
        for(let i=0; i<_productList.length;  i++){
            let specArr = _productList[i].goods_specification_ids.split('_');
            for(let n=0;n<specArr.length;  n++){
                if(specValueId == specArr[n]){
                   specArr = specArr.filter((val)=>{return val!=specValueId});
                   lastSpecArr = lastSpecArr.concat(specArr);
                }
            }

        }
        lastSpecArr=lastSpecArr.distinct();
        for(let i=0; i< _specificationList.length; i++){
            if(specNameId != _specificationList[i].specification_id){
                for(let m=0; m<_specificationList[i].valueList.length; m++){
                    for (let n = 0; n < lastSpecArr.length; n++) {
                        if (lastSpecArr[n] == _specificationList[i].valueList[m].id) {
                            _specificationList[i].valueList[m]['disabled'] = false;
                            break;
                        } else {
                            _specificationList[i].valueList[m]['disabled'] = true;
                        }
                    }
                }
            }

        }

    },

    //获取选中的规格信息
    getCheckedSpecValue: function () {
        let checkedValues = [];
        let _specificationList = this.data.specificationList;
        for (let i = 0; i < _specificationList.length; i++) {
            let _checkedObj = {
                nameId: _specificationList[i].specification_id,
                valueId: 0,
                checkedImg: '',
                valueText: ''
            };
            for (let j = 0; j < _specificationList[i].valueList.length; j++) {
                if (_specificationList[i].valueList[j].checked) {
                    _checkedObj.valueId = _specificationList[i].valueList[j].id;
                    _checkedObj.valueText = _specificationList[i].valueList[j].value;
                    // _checkedObj.checkedImg = _specificationList[i].valueList[j].pic_url;
                }
            }
            checkedValues.push(_checkedObj);
        }
        return checkedValues;

    },
    //根据已选的值，计算其它值的状态
    setSpecValueStatus: function () {
        let selectSpecValue = this.getCheckedSpecValue();
        selectSpecValue.some((v, index, arr) => {
            if (v.valueId == '' || null) {
                this.setData({
                    $toast: {
                        show: true
                    }
                });
                setTimeout(() => {
                    this.setData({
                        $toast: {
                            show: false
                        }
                    })
                }, 1500);
            }
        })


    },
    //判断规格是否选择完整
    isCheckedAllSpec: function () {
        return !this.getCheckedSpecValue().some(function (v) {
            if (v.valueId == 0) {
                return true;
            }
        });
    },
    getCheckedSpecKey: function () {
        let checkedValue = this.getCheckedSpecValue().map(function (v) {
            return v.valueId;
        });

        return checkedValue.join('_');
    },
    // 清空规格选中参数
    clearOutSku(){
        let _specificationList = this.data.specificationList;
        _specificationList.map((obj, index, array)=>{
            obj.valueList.map((o, indexx, arr)=>{
                o.disabled = false;
            })
        })
    },
    changeSpecInfo: function () {
        let checkedNameValue = this.getCheckedSpecValue();
        //设置选择的信息
        let chosedSpec = [];
        let checkedValue = checkedNameValue.filter(function (v) {
            if (v.valueId != 0) {
                chosedSpec.push(v.valueId);
                return true;
            } else {
                return false;
            }
        }).map(function (v) {
            return v.valueText;
        });

        // 查询该规格产品价格
        let _productList = this.data.productList;
        let _goods = this.data.goods;
        let _retail_price = '';
        for (let i = 0; i<_productList.length; i++){
            let goods_specification_idsArr = _productList[i].goods_specification_ids.split('_');
            if(goods_specification_idsArr.sort().toString()===chosedSpec.sort().toString()){
                _retail_price = _productList[i].retail_price;
            }
        }
        _goods.retail_price = _retail_price;


        if (checkedValue.length > 0) {
            this.setData({
                checkedSpecText: checkedValue.join('　'),
                goods:_goods
            });
        } else {
            this.clearOutSku();
            let _specificationList = this.data.specificationList;
            let _new_goods =  this.data.new_goods;
            this.setData({
                checkedSpecText: '请选择规格数量',
                goods: _new_goods,
                specificationList: _specificationList
            });
        }
    },
    getCheckedProductItem: function (key) {
        return this.data.productList.filter((v) => {
            //规格比较
            let idsArr = v.goods_specification_ids.split('_').sort();
            let idsArr2 = key.split('_').sort();
            // v.goods_specification_ids.sort();
            if (idsArr.toString() === idsArr2.toString()) {
                return true;
            } else {
                // 没有该规格组合的产品
                return false;
                /*  wx.showToast({
                 title: '成功',
                 icon: 'success',
                 duration: 2000,
                 complete: function () {
                 return false;
                 }
                 })*/
                /* this.setData({
                 $toast: {
                 show: true
                 }
                 });
                 setTimeout(() => {
                 this.setData({
                 $toast: {
                 show: false
                 }
                 })
                 }, 1500);*/
                // return false;
            }
        });
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            id: parseInt(options.id)
            // id: 1181000
        });

    },
    onReady: function () {
        // 页面渲染完成

    },
    onShow: function () {
        wx.setNavigationBarTitle({
            title: "爱学习小店"
        });
        // 页面显示 返回后页面不刷新，也需要数据，需要刷新的操作写在onshow，，不需要刷新的操作写在onload
        let that = this;
        this.getGoodsInfo();
        util.request(api.CartGoodsCount).then(function (res) {
            if (res.errno === 0) {
                that.setData({
                    cartGoodsCount: res.data.cartTotal.goodsCount
                });

            }
        });
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭

    },
    switchAttrPop: function () {
        if (this.data.openAttr == false) {
            this.setData({
                openAttr: !this.data.openAttr,
                collectBackImage: "/static/images/detail_back.png"
            });
        }
    },
    closeAttrOrCollect: function () {
        let that = this;
        if (this.data.openAttr) {
            this.setData({
                openAttr: false,
            });
            if (that.data.userHasCollect == 1) {
                that.setData({
                    'collectBackImage': that.data.hasCollectImage
                });
            } else {
                that.setData({
                    'collectBackImage': that.data.noCollectImage
                });
            }
        } else {
            //添加或是取消收藏
            util.request(api.CollectAddOrDelete, {typeId: 0, valueId: this.data.id}, "POST")
                .then(function (res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        if (_res.data.type == 'add') {
                            that.setData({
                                'collectBackImage': that.data.hasCollectImage
                            });
                        } else {
                            that.setData({
                                'collectBackImage': that.data.noCollectImage
                            });
                        }

                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: _res.errmsg,
                            mask: true
                        });
                    }

                });
        }

    },
    openCartPage: function () {
        wx.switchTab({
            url: '/pages/cart/cart',
        });
    },

    /**
     * 直接购买
     */
    buyGoods: function () {
        let that = this;
        if (this.data.openAttr == false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr,
                collectBackImage: "/static/images/detail_back.png"
            });
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProduct || checkedProduct.length <= 0) {
                //找不到对应的product信息，提示没有库存
                return false;
            }

            //验证库存
            if (checkedProduct.goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                return false;
            }

            // 直接购买商品
            util.request(api.BuyAdd, {
                goodsId: this.data.goods.id,
                number: this.data.number,
                productId: checkedProduct[0].id
            }, "POST")
                .then(function (res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        that.setData({
                            openAttr: !that.data.openAttr,
                        });
                        wx.navigateTo({
                            url: '/pages/shopping/checkout/checkout?isBuy=true',
                        })
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: _res.errmsg,
                            mask: true
                        });
                    }

                });

        }
    },

    /**
     * 添加到购物车
     */
    addToCart: function () {
        let that = this;
        if (this.data.openAttr == false) {
            //打开规格选择窗口
            this.setData({
                openAttr: !this.data.openAttr,
                collectBackImage: "/static/images/detail_back.png"
            });
        } else {

            //提示选择完整规格
            if (!this.isCheckedAllSpec()) {
                return false;
            }

            //根据选中的规格，判断是否有对应的sku信息
            let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
            if (!checkedProduct || checkedProduct.length <= 0) {
                //找不到对应的product信息，提示没有库存
                return false;
            }

            //验证库存
            if (checkedProduct.goods_number < this.data.number) {
                //找不到对应的product信息，提示没有库存
                return false;
            }

            //添加到购物车
            util.request(api.CartAdd, {
                goodsId: this.data.goods.id,
                number: this.data.number,
                productId: checkedProduct[0].id
            }, "POST")
                .then(function (res) {
                    let _res = res;
                    if (_res.errno == 0) {
                        wx.showToast({
                            title: '添加成功'
                        });
                        that.setData({
                            openAttr: !that.data.openAttr,
                            cartGoodsCount: _res.data.cartTotal.goodsCount
                        });
                        if (that.data.userHasCollect == 1) {
                            that.setData({
                                'collectBackImage': that.data.hasCollectImage
                            });
                        } else {
                            that.setData({
                                'collectBackImage': that.data.noCollectImage
                            });
                        }
                    } else {
                        wx.showToast({
                            image: '/static/images/icon_error.png',
                            title: _res.errmsg,
                            mask: true
                        });
                    }

                });
        }

    },
    cutNumber: function () {
        this.setData({
            number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
        });
    },
    addNumber: function () {
        this.setData({
            number: this.data.number + 1
        });
    },
    goMallPage(){
        debugger
        wx.switchTab({
            url: '/pages/mall/mall'
        })
    }
})