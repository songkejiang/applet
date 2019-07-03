// 分发actions，页面的action同意dispatch到此进行逻辑处理
import * as types from './mutation-types.js'
import Vue from 'vue'
const that = Vue.prototype
function warning (res) {
  if (/^7100.*$/.test(res.errorCode)) {
    if (res.errorCode === '71001' || res.errorCode === '71003') {
      return wx.showModal({
        // title: '提示',
        content: res.msg,
        showCancel: false,
        success (e) {
          wx.navigateBack()
        }
      })
    }
    if (res.errorCode === '71002') {
      return wx.showModal({
        // title: '提示',
        content: res.msg,
        showCancel: true,
        success (e) {
          if (e.confirm) {
            return wx.navigateTo({
              url: '/pages/login/main?from=login'
            })
          } else if (e.cancel) {
            return wx.navigateBack()
          }
        }
      })
    }
  }
  if (res.errorCode !== '200') {
    return wx.showToast({
      title: res.msg,
      icon: 'none',
      duration: 3000
    })
  }
  return true
}
// 获取我的关注接口
export const getMycollect = async ({ commit, rootState }, params = {}) => {
  await that.$http
    .post('/liveProgram/liveHome/follow/liveProgram', Object.assign({
      orderType: 'default',
      pageNum: 1,
      pageSize: 4
    }, params))
    .then(res => {
      commit({
        type: types.SETMYCOLLECT,
        collectList: res.data
      })
    })
}

// 获取今日直播接口
export const getTodyLive = async ({ commit, rootState }, params = {}) => {
  await that.$http
    .post('/open/live/home/todayLive', Object.assign({
      pageNum: 1,
      pageSize: 4
    }, params, {loading: true}))
    .then(res => {
      commit({
        type: types.SETTODAYLIVELIST,
        todayLiveList: res.data
      })
    })
}
// 获取标签
export const getLiveLabel = ({commit}, params = {}) => {
  that.$http.get(`/open/liveLabel`, Object.assign({
    pageNum: 1,
    pageSize: 4
  }, params))
    .then(res => {
      commit({
        type: types.SETLIVELABEL,
        labelList: res.data
      })
      return Promise.resolve(res)
    })
}

// 课程-根据推荐位CODE获取推荐课程列表- 精品课程
export const getSeriesRecmmend = ({commit}, params = {}) => {
  commit({
    type: 'SETSERIESRECOMMENDLIST',
    seriesRecommendList: ''
  })
  return that.$http.post(`/open/series/get/recommend`, Object.assign({
    pageNum: 1,
    pageSize: 12
  }, params))
    .then(res => {
      commit({
        type: types.SETSERIESRECOMMENDLIST,
        seriesRecommendList: res
      })
      return Promise.resolve(res)
    })
}

// 视频-根据推荐位CODE获取推荐视频列表-分页 精选视频
export const getVideoRecmmend = ({ commit, rootState }, params = {}) => {
 return that.$http
    .post('/open/video/get/recommend', Object.assign({
      pageNum: 1,
      pageSize: 12
    }, params))
    .then(res => {
      commit({
        type: types.SETVIDEORECOMMENDLIST,
        videoRecommendList: res
      })
      return Promise.resolve(res)
    })
}

// 课程-获取公开系列课程一览 系列课程
export const getSeriesPage = ({commit}, params = {}) => {
  commit({
    type: 'SETSERIESPAGE',
    seriesPageList: ''
  })
  return that.$http.post(`/open/series/page`, Object.assign({
    pageNum: 1,
    pageSize: 12
  }, params))
    .then(res => {
      commit({
        type: types.SETSERIESPAGE,
        seriesPageList: res
      })
      return Promise.resolve(res)
    })
}

// 视频-获取公开视频列表 视频列表
export const getVideoPage = ({commit}, params = {}) => {
  commit({
    type: 'SETVIDEOPAGE',
    videoPageList: ''
  })
  that.$http.post(`/open/video/page`, Object.assign({
    pageNum: 1,
    pageSize: 12
  }, params))
    .then(res => {
      commit({
        type: types.SETVIDEOPAGE,
        videoPageList: res
      })
    })
}

// 公开-获取直播节目
export const getLiveProgramePage = ({commit}, params = {}) => {
  commit({
    type: 'SETLIVEPROGRAMEPAGELIST',
    liveProgramePageList: ''
  })
  that.$http.post(`/liveProgram/page`, Object.assign({
    pageNum: 1,
    pageSize: 12
  }, params))
    .then(res => {
      commit({
        type: types.SETLIVEPROGRAMEPAGELIST,
        liveProgramePageList: res
      })
    })
}

// 获取视频详情
export const getVideoDetails = async ({commit, state}, params = {}) => {
  console.log(state)
  // commit({
  //   type: 'SETVIDEODETAILS',
  //   videoDetails: ''
  // })
  try {
    let res = await that.$http.get(`/open/video/details/${params.videoId}`, {}, {control: true})
    if (warning(res) !== true) return
    commit({
      type: types.SETVIDEODETAILS,
      videoDetails: res
    })
    return Promise.resolve(res.entity)
  } catch (res) {
    warning(res)
  }
}
// 获取课程详情
export const getSeriesDetails = async ({commit}, params = {}) => {
  // commit({
  //   type: 'SETSERIESDETAILS',
  //   seriesDetail: ''
  // })
  try {
    let res = await that.$http.get(`/open/series/details/${params.seriesId}`, {}, {control: true})
    if (warning(res) !== true) return
    commit({
      type: types.SETSERIESDETAILS,
      seriesDetail: res
    })
    return Promise.resolve(res.entity)
  } catch (res) {
    warning(res)
  }
}

// 获取优惠券
export const getCoupons = ({commit}, params = {}) => {
  commit({
    type: 'SETCOUPONLIST',
    couponList: ''
  })
  that.$http.post(`/user/coupons`, Object.assign({
    pageNum: 1,
    pageSize: 12
  }, params))
    .then(res => {
      commit({
        type: types.SETCOUPONLIST,
        couponList: res.data
      })
    })
}
// 获取片头视频
export const getHeadVideo = ({commit}, params = {}) => {
  commit({
    type: 'SETHEADVIDEO',
    headVideoInfo: ''
  })
  that.$http.get(`/open/app/head/get`).then((res) => {
    commit({
      type: types.SETHEADVIDEO,
      headVideoInfo: res.entity
    })
  })
}

// 获取直播详情
export const getLiveDetails = async ({commit}, params = {}) => {
  // commit({
  //   type: 'SETLIVEDETAILS',
  //   liveDetails: ''
  // })
  try {
    let res = await that.$http.get(`/open/program/${params.videoId}`, {}, {control: true})
    if (warning(res) !== true) return
    commit({
      type: types.SETLIVEDETAILS,
      liveDetails: res
    })
    return Promise.resolve(res.entity)
  } catch (res) {
    warning(res)
  }
}

// 视频支付接口
export const videoPay = ({commit}, params = {}) => {
  commit({
    type: 'SETVIDEOPAYTYPE',
    videoPayStatus: ''
  })
  that.$http.post(`/liveVideoPay/C/firstBuyVideo`, Object.assign({
    openId: this.$store.state.openId,
    paymentChannel: 'WXPAY',
    platformType: 'JSAPI',
    serverId: +this.$route.query.id
  }, params)).then((res) => {

  })
}

// 获取个人信息
export const setPersonalInfo = ({commit}) => {
  that.$http.get(`/users/info`).then(res => {
    console.log(res)
    commit({
      type: types.SET_PERSONAL_INFO,
      info: res.entity
    })
  })
}

// 我的收藏-新闻
export const setNewsList = ({commit, state}, params = {}) => {
  return that.$http.get(`/app/Home/N/selectCollectList`, params).then(res => {
    const newsList = state.collectNewsList.slice()
    const responseData = res.data
    const newData = newsList.concat(responseData)
    const totalPages = res.totalPages
    commit({
      type: types.SET_COLLECT_NEWS_LIST,
      list: newData
    })
    return Promise.resolve({
      totalPages
    })
  })
}

// 我的收藏-直播
export const setLiveList = ({commit, state}, params = {}) => {
  commit({
    type: types.SET_COLLECT_LIVE_LIST,
    list: ''
  })
  return that.$http.post(`/liveProgram/user/collect`, params).then(res => {
    const totalPages = res.totalPages
    commit({
      type: types.SET_COLLECT_LIVE_LIST,
      list: res.data
    })
    return Promise.resolve({
      totalPages
    })
  })
}

// 我的收藏-视频
export const setVideoList = ({commit, state}, params = {}) => {
  commit({
    type: types.SET_COLLECT_VIDEO_LIST,
    list: []
  })
  return that.$http.post(`/video/user/collect`, params).then(res => {
    const totalPages = res.totalPages
    commit({
      type: types.SET_COLLECT_VIDEO_LIST,
      list: res.data
    })
    return Promise.resolve({
      totalPages: totalPages
    })
  })
}

// 我的收藏-课程
export const setSeriesList = ({commit, state}, params = {}) => {
  commit({
    type: types.SET_COLLECT_SERIES_LIST,
    list: ''
  })
  return that.$http.post(`/series/user/collect/page`, params).then(res => {
    const totalPages = res.totalPages
    commit({
      type: types.SET_COLLECT_SERIES_LIST,
      list: res.data
    })
    return Promise.resolve({
      totalPages
    })
  })
}

// 我的收藏-会议
export const setMeetingList = ({commit, state}, params = {}) => {
  return that.$http.get(`/app/Event/C/getEventCollectList`, params).then(res => {
    const meetingList = state.collectMeetingList.slice()
    const responseData = res.data
    const newData = meetingList.concat(responseData)
    const totalPages = res.totalPages
    commit({
      type: types.SET_COLLECT_MEETING_LIST,
      list: newData
    })
    return Promise.resolve({
      totalPages
    })
  })
}

// 我的订单-待支付或支付-直播订单
export const setIsPayLiveList = async ({commit, state}, params = {}) => {
  if (params.tradeStatus === 'WAIT_PAY') {
    commit({
      type: types.SET_UNPAY_LIVE_LIST,
      list: ''
    })
  } else {
    commit({
      type: types.SET_PAY_LIVE_LIST,
      list: ''
    })
  }
  await that.$http.post(`/liveProgram/user/order`, params).then(res => {
    if (params.tradeStatus === 'WAIT_PAY') {
      commit({
        type: types.SET_UNPAY_LIVE_LIST,
        list: res.data
      })
    } else {
      commit({
        type: types.SET_PAY_LIVE_LIST,
        list: res.data
      })
    }
  })
}

// 我的订单-待支付或支付-视频订单
export const setIsPayVideoList = async ({commit, state}, params = {}) => {
  if (params.tradeStatus === 'WAIT_PAY') {
    commit({
      type: types.SET_UNPAY_VIDEO_LIST,
      list: ''
    })
  } else {
    commit({
      type: types.SET_PAY_VIDEO_LIST,
      list: ''
    })
  }
  await that.$http.post(`/video/user/order`, params).then(res => {
    if (params.tradeStatus === 'WAIT_PAY') {
      commit({
        type: types.SET_UNPAY_VIDEO_LIST,
        list: res.data
      })
    } else {
      commit({
        type: types.SET_PAY_VIDEO_LIST,
        list: res.data
      })
    }
  })
}

// 我的订单-待支付或支付-系列课程
export const setIsPaySeriesList = async ({commit, state}, params = {}) => {
  if (params.tradeStatus === 'WAIT_PAY') {
    commit({
      type: types.SET_UNPAY_SERIES_LIST,
      list: ''
    })
  } else {
    commit({
      type: types.SET_PAY_SERIES_LIST,
      list: ''
    })
  }
  await that.$http.post(`/liveVideoPay/order/A/orderSeries`, params).then(res => {
    if (params.tradeStatus === 'WAIT_PAY') {
      commit({
        type: types.SET_UNPAY_SERIES_LIST,
        list: res.data
      })
    } else {
      commit({
        type: types.SET_PAY_SERIES_LIST,
        list: res.data
      })
    }
  })
}

// 视频详情页-相关视频tab列表
export const setVideoRelated = ({commit, state}, params = {}) => {
  commit({
    type: 'SET_VIDEO_RELATED_LIST',
    list: ''
  })
  return that.$http.post(`/open/video/page`, params).then(res => {
    commit({
      type: types.SET_VIDEO_RELATED_LIST,
      list: res.data
    })
    return Promise.resolve({
      totalPages: res.totalPages
    })
  })
}

// 视频详情页-评论tab
export const setComments = ({commit, state}, params = {}) => {
  commit({
    type: types.SET_COMMENT_LIST,
    list: ''
  })
  that.$http.post(`/open/video/comment/page/${params.videoId}`, params).then(res => {
    commit({
      type: types.SET_COMMENT_LIST,
      list: res.data
    })
  })
}

// 视频详情页-评论tab
export const setSeriesComments = ({commit, state}, params = {}) => {
  commit({
    type: types.SET_SERIES_COMMENT_LIST,
    list: ''
  })
  that.$http.post(`/open/series/comment/page/${params.seriesId}`, params).then(res => {
    commit({
      type: types.SET_SERIES_COMMENT_LIST,
      list: res.data
    })
  })
}
// 查询是否关注主播
export const getFollowStatus = ({commit, state}, params = {}) => {
  if (!state.token) {
    commit({
      type: types.GET_FOLLOW_STATUS,
      status: false
    })
    return
  }
  that.$http.post(`/appNewContent/Follow/A/getFollowStatus`, params).then(res => {
    commit({
      type: types.GET_FOLLOW_STATUS,
      status: res.entity.entity
    })
  })
}

// 取消/关注主播
export const setFollowStatus = ({commit, state}, params = {}) => {
  if (!state.token) {
    return wx.navigateTo({
      url: '/pages/login/main?from=login'
    })
  }
  const followStatus = state.followStatus
  that.$http.post(`/appNewContent/Follow/B/operateFollow`, params).then(res => {
    commit({
      type: types.GET_FOLLOW_STATUS,
      status: !followStatus
    })
  })
}

// 收藏
export const setCollectionStatus = ({commit, state}, params = {}) => {
  if (!state.token) {
    return wx.navigateTo({
      url: '/pages/login/main?from=login'
    })
  }
  that.$http.post(`/users/collect/add`, params).then(res => {
    commit({
      type: types.GET_COLLECTION_STATUS,
      status: res.entity
    })
  })
}

// 赞
export const setZanStatus = ({commit, state}, params = {}) => {
  if (!state.token) {
    return wx.navigateTo({
      url: '/pages/login/main?from=login'
    })
  }
  that.$http.post(`/users/userLike/add`, params).then(res => {
    commit({
      type: types.GET_ZAN_STATUS,
      status: res.entity
    })
  })
}

// 直播详情页-大咖-相关视频
export const getLiveRelatedVideo = ({commit, state}, params = {}) => {
  commit({
    type: types.GET_LIVE_RELATED,
    list: ''
  })
  return that.$http.post(`/open/video/page`, params).then(res => {
    commit({
      type: types.GET_LIVE_RELATED,
      list: res.data
    })
    return Promise.resolve({
      totalPages: res.totalPages
    })
  })
}

// 直播详情页-会议-相关预告
export const getLiveRelatedForeshow = ({commit, state}, params = {}) => {
  commit({
    type: types.GET_LIVE_RELATED_FORESHOW,
    list: []
  })
  return that.$http.post(`/liveProgram/page`, params).then(res => {
    commit({
      type: types.GET_LIVE_RELATED_FORESHOW,
      list: res.data
    })
    return Promise.resolve({
      totalPages: res.totalPages
    })
  })
}

// 我的红包
export const setCouponsList = ({commit, state}, params = {}) => {
  return that.$http.post(`/user/coupons/noPage`, params).then(res => {
    const totalPages = res.totalPages
    commit({
      type: types.SET_COUPONS_LIST,
      list: res.data
    })
    return Promise.resolve({
      totalPages
    })
  })
}
// 获取优惠价格
export const setCouponId = ({commit, state}, params = {}) => {
  return that.$http.get(`/liveVideoPay/A1/getPayAmount?serverId=${params.serverId}&couponUserId=${state.couponId}&videoType=${params.videoType}`).then(res => {
    return Promise.resolve(res.entity)
  })
}
