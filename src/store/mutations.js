import * as types from './mutation-types'
const mutation = {
  /**
   * state:当前状态树
   * v: 提交matations时传的参数
   */
  loading (state, v) {
    state.loading = v
  },
  showInvalid (state, v) {
    state.showInvalid = v
  },
  loadMoreLoading (state, v) {
    state.loadMoreLoading = v
  },
  setpageInfo (state, v) {
    state.pageInfo = v
  },
  setListLen (state, v) {
    state.listLen = v
  },
  [types.SET_OPEN_ID] (state, v) {
    state.openId = v
  },
  [types.SET_USERINFO] (state, v) {
    state.userInfo = v
  },
  [types.SET_TOKEN] (state, v) {
    console.log(v)
    state.token = v
  },
  // 我的收藏
  [types.SETMYCOLLECT] (state, v) {
    state.collectList = v.collectList
  },
  // 今日关注
  [types.SETTODAYLIVELIST] (state, v) {
    state.todayLiveList = v.todayLiveList
  },
  // 获取推荐位视频列表
  [types.SETVIDEORECOMMENDLIST] (state, v) {
    state.videoRecommendList = v.videoRecommendList
  },
  // 获取标签
  [types.SETLIVELABEL] (state, v) {
    state.labelList = v.labelList
  },
  // 获取推荐位课程列表
  [types.SETSERIESRECOMMENDLIST] (state, v) {
    state.seriesRecommendList = v.seriesRecommendList
  },
  // 获取公开系列课程
  [types.SETSERIESPAGE] (state, v) {
    state.seriesPageList = v.seriesPageList
  },
  // 获取公开视频
  [types.SETVIDEOPAGE] (state, v) {
    state.videoPageList = v.videoPageList
  },
  // 获取直播节目
  [types.SETLIVEPROGRAMEPAGELIST] (state, v) {
    state.liveProgramePageList = v.liveProgramePageList
  },
  // 获取视频详情
  [types.SETVIDEODETAILS] (state, v) {
    state.videoDetails = v.videoDetails
  },
  // 获取视频详情
  [types.SETLIVEDETAILS] (state, v) {
    state.liveDetails = v.liveDetails
  },
  // 获取课程详情
  [types.SETSERIESDETAILS] (state, v) {
    state.seriesDetail = v.seriesDetail
  },
  // 获取优惠券
  [types.SETCOUPONLIST] (state, v) {
    state.couponList = v.couponList
  },
  // 获取片头视频
  [types.SETHEADVIDEO] (state, v) {
    state.headVideoInfo = v.headVideoInfo
  },
  // 我的主页个人信息
  [types.SET_PERSONAL_INFO] (state, {info}) {
    state.personalInfo = info
  },
  // 我的收藏-新闻
  [types.SET_COLLECT_NEWS_LIST] (state, {list}) {
    state.collectNewsList = list
  },
  // 我的收藏-直播
  [types.SET_COLLECT_LIVE_LIST] (state, {list}) {
    state.collectLiveList = list
  },
  // 我的收藏-视频
  [types.SET_COLLECT_VIDEO_LIST] (state, {list}) {
    state.collectVideoList = list
  },
  // 我的收藏-课程
  [types.SET_COLLECT_SERIES_LIST] (state, {list}) {
    state.collectSeriesList = list
  },
  // 我的收藏-会议
  [types.SET_COLLECT_MEETING_LIST] (state, {list}) {
    state.collectMeetingList = list
  },
  // 我的订单-待支付-直播列表
  [types.SET_UNPAY_LIVE_LIST] (state, {list}) {
    state.unpayLiveList = list
  },
  // 我的订单-待支付-视频列表
  [types.SET_UNPAY_VIDEO_LIST] (state, {list}) {
    state.unpayVideoList = list
  },
  // 我的订单-待支付-系列课程列表
  [types.SET_UNPAY_SERIES_LIST] (state, {list}) {
    state.unpaySeriesList = list
  },
  // 我的订单-支付-直播列表
  [types.SET_PAY_LIVE_LIST] (state, {list}) {
    state.payLiveList = list
  },
  // 我的订单-支付-视频列表
  [types.SET_PAY_VIDEO_LIST] (state, {list}) {
    state.payVideoList = list
  },
  // 我的订单-支付-系列课程列表
  [types.SET_PAY_SERIES_LIST] (state, {list}) {
    state.paySeriesList = list
  },
  // 视频详情页-相关视频列表
  [types.SET_VIDEO_RELATED_LIST] (state, {list}) {
    console.log('videoRelatedList', list)
    state.videoRelatedList = list
  },
  // 视频详情页-相关视频列表
  [types.SET_COMMENT_LIST] (state, {list}) {
    state.commentList = list
  },
  // 系列课程详情页-评论列表
  [types.SET_SERIES_COMMENT_LIST] (state, {list}) {
    state.seriesCommentList = list
  },

  // 我的红包列表
  [types.SET_COUPONS_LIST] (state, {list}) {
    state.couponsList = list
  },
  // 关注主播
  [types.GET_FOLLOW_STATUS] (state, {status}) {
    state.followStatus = status
  },
  // 收藏主播
  [types.GET_COLLECTION_STATUS] (state, {status}) {
    state.collectionStatus = status
  },
  // 赞主播
  [types.GET_ZAN_STATUS] (state, {status}) {
    state.zanStatus = status
  },
  // 直播详情页-大咖-相关视频列表
  [types.GET_LIVE_RELATED] (state, {list}) {
    state.liveRelatedList = list
  },
  // 直播详情页-会议-相关预告
  [types.GET_LIVE_RELATED_FORESHOW] (state, {list}) {
    state.liveRelatedForeshowList = list
  },
  // 设置优惠券id
  [types.SET_COUPON_ID] (state, {couponId}) {
    state.couponId = couponId
  },
  // 设置页面来源
  [types.PAGE_ORIGIN] (state, {ORIGIN}) {
    state.from = ORIGIN
  }
}
export default mutation
