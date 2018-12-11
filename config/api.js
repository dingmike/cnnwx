// var NewApiRootUrl = 'http://localhost:8080/api/';
var NewApiRootUrl = 'http://cnnfront.tunnel.qydev.com/api/';
// let NewApiRootUrl = 'https://api.fecstec.com/platform-admin-1.0.0/api/';

module.exports = {
    CnnIndexUrl: NewApiRootUrl + 'index/cnnIndex', // cnn首页数据接口
    CnnIndexTypeTwo: NewApiRootUrl + 'index/cnnIndexTypeTwo', // cnn首页数据接口类型2

    IndexUrl: NewApiRootUrl + 'index/index', //商城首页数据接口
    UpdateUserInfo: NewApiRootUrl + 'user/updateUserInfo', //更新微信用户信息
    GetLearnInfo: NewApiRootUrl + 'user/getLearnInfo', //更新微信用户学习信息 @params uid
    GetGongduContent: NewApiRootUrl + 'gongdu/getContent', //每天的学习主要内容
    GetOraleDetail: NewApiRootUrl + 'gongdu/getOraleDetail', //每天的学习重点和问答
    GetCardNums: NewApiRootUrl + 'gongdu/getCardNums', //每天的有效打卡
    GetCardRecord: NewApiRootUrl + 'gongdu/getCardRecord', //每天的打卡记录
    SetCardById: NewApiRootUrl + 'gongdu/setCardById', //每天打卡
    GetOneCard: NewApiRootUrl + 'gongdu/getOneCard', //每天打卡
    SetRemindTime: NewApiRootUrl + 'gongdu/setRemindTime', //设置提醒时间 /api/gdOrder
    GetReadNewsByUserId: NewApiRootUrl + 'gongdu/getReadNewsByUserId', // 获取用户阅读的文章
    GetAllNews: NewApiRootUrl + 'gongdu/getAllNews', // 获取全部文章
    GetAllReadNewsId: NewApiRootUrl + 'gongdu/getAllReadNewsId', // 获取全部已读文章ID数组



    GetNewsById: NewApiRootUrl + 'gongdu/getNewsById', // 获取用户阅读的文章
    SetNewsCard: NewApiRootUrl + 'gongdu/setNewsCard', // 用户打卡阅读的文章
    GetTodayNews: NewApiRootUrl + 'gongdu/getTodayNews', // 当天打卡阅读的文章
    HaveReaded: NewApiRootUrl + 'gongdu/haveReaded', // 当天是否已打过卡了

    AddFormId: NewApiRootUrl + 'gongdu/addFormId', // 添加formID

    Deduction: NewApiRootUrl + 'gongdu/deduction', // 能力券抵扣率

    GongduOrderSubmit: NewApiRootUrl + 'gdOrder/submit', // 生成共读订单

    UserIntergralInfo: NewApiRootUrl + 'user/getUserIntergralInfo', // 获取积分余额信息
    UserSubmitPhone: NewApiRootUrl + 'user/submitPhone', // 绑定微信和手机号

    IndexUrlNewGoods: NewApiRootUrl + 'index/newGoods', //新产品
    IndexUrlHotGoods: NewApiRootUrl + 'index/hotGoods', //首页数据接口
    IndexUrlTopic: NewApiRootUrl + 'index/topic', //首页数据接口
    IndexUrlBrand: NewApiRootUrl + 'index/brand', //首页数据接口IndexUrlChannel
    IndexUrlCategory: NewApiRootUrl + 'index/category', //首页数据接口IndexUrlChannel
    IndexUrlBanner: NewApiRootUrl + 'index/banner', //首页数据接口IndexUrlChannel
    IndexUrlChannel: NewApiRootUrl + 'index/channel', //首页数据接口IndexUrlChannel
    EnterLearnClass: NewApiRootUrl + 'index/enterLearnClass', //参加每日阅读计划


    CatalogList: NewApiRootUrl + 'catalog/index',  //分类目录全部分类数据接口
    CatalogCurrent: NewApiRootUrl + 'catalog/current',  //分类目录当前分类数据接口

    AuthLoginByWeixin: NewApiRootUrl + 'auth/login_by_weixin', //微信登录

    GoodsCount: NewApiRootUrl + 'goods/count',  //统计商品总数
    GoodsList: NewApiRootUrl + 'goods/list',  //获得商品列表
    GoodsCategory: NewApiRootUrl + 'goods/category',  //获得分类数据
    GoodsDetail: NewApiRootUrl + 'goods/detail',  //获得商品的详情
    GoodsNew: NewApiRootUrl + 'goods/new',  //新品
    GoodsHot: NewApiRootUrl + 'goods/hot',  //热门
    GoodsRelated: NewApiRootUrl + 'goods/related',  //商品详情页的关联商品（大家都在看）

    BrandList: NewApiRootUrl + 'brand/list',  //品牌列表
    BrandDetail: NewApiRootUrl + 'brand/detail',  //品牌详情

    CartList: NewApiRootUrl + 'cart/index', //获取购物车的数据
    CartAdd: NewApiRootUrl + 'cart/add', // 添加商品到购物车
    BuyAdd: NewApiRootUrl + 'buy/add', // 直接购买
    CartUpdate: NewApiRootUrl + 'cart/update', // 更新购物车的商品
    CartDelete: NewApiRootUrl + 'cart/delete', // 删除购物车的商品
    CartChecked: NewApiRootUrl + 'cart/checked', // 选择或取消选择商品
    CartGoodsCount: NewApiRootUrl + 'cart/goodscount', // 获取购物车商品件数
    CartCheckout: NewApiRootUrl + 'cart/checkout', // 下单前信息确认


    BuyCheckout: NewApiRootUrl + 'buy/checkout', // 下单前信息确认

    OrderSubmit: NewApiRootUrl + 'order/submit', // 提交订单
    PayPrepayId: NewApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id
    PayGongDuPrepayId: NewApiRootUrl + 'pay/gongDuPrepay', //获取微信统一下单prepay_id 共读

    CollectList: NewApiRootUrl + 'collect/list',  //收藏列表
    CollectAddOrDelete: NewApiRootUrl + 'collect/addordelete',  //添加或取消收藏

    CommentList: NewApiRootUrl + 'comment/list',  //评论列表
    CommentCount: NewApiRootUrl + 'comment/count',  //评论总数
    CommentPost: NewApiRootUrl + 'comment/post',   //发表评论

    TopicList: NewApiRootUrl + 'topic/list',  //专题列表
    TopicDetail: NewApiRootUrl + 'topic/detail',  //专题详情
    TopicRelated: NewApiRootUrl + 'topic/related',  //相关专题

    SearchIndex: NewApiRootUrl + 'search/index',  //搜索页面数据
    SearchResult: NewApiRootUrl + 'search/result',  //搜索数据
    SearchHelper: NewApiRootUrl + 'search/helper',  //搜索帮助
    SearchClearHistory: NewApiRootUrl + 'search/clearhistory',  //搜索帮助

    AddressList: NewApiRootUrl + 'address/list',  //收货地址列表
    AddressDetail: NewApiRootUrl + 'address/detail',  //收货地址详情
    AddressSave: NewApiRootUrl + 'address/save',  //保存收货地址
    AddressDelete: NewApiRootUrl + 'address/delete',  //保存收货地址

    RegionList: NewApiRootUrl + 'region/list',  //获取区域列表

    OrderList: NewApiRootUrl + 'order/list',  //订单列表
    OrderDetail: NewApiRootUrl + 'order/detail',  //订单详情
    OrderCancel: NewApiRootUrl + 'order/cancelOrder',  //取消订单
    ConfirmOrder: NewApiRootUrl + 'order/confirmOrder',  //确认收货

    FootprintList: NewApiRootUrl + 'footprint/list',  //足迹列表
    FootprintDelete: NewApiRootUrl + 'footprint/delete',  //删除足迹

    FeedbackAdd: NewApiRootUrl + 'feedback/save', //添加反馈
    SmsCode: NewApiRootUrl + 'user/smscode', //发送短信
    BindMobile: NewApiRootUrl + 'user/bindMobile', //绑定手机
    Login: NewApiRootUrl + 'auth/login', //账号登录
    Register: NewApiRootUrl + 'register/register', //注册普通用户
    CouponList: NewApiRootUrl + 'coupon/list', // 优惠券列表
    GoodsCouponList: NewApiRootUrl + 'coupon/listByGoods', // 商品优惠券列表
    OrderQuery: NewApiRootUrl + 'pay/query',  // 查询写
    OrderGongDuQuery: NewApiRootUrl + 'pay/gongDuQuery',
    OrderSuccess: NewApiRootUrl + 'order/updateSuccess',
    /*newscnn learning api*/
    // ReadRecord: NewApiRootUrl + 'newscnn/recordList'   // 用户阅读列表
};
