// src/utils/net.js
// import wx from 'wx' // 引用微信小程序wx对象
// var path = require('path')
import store from '../store'
const baseurl = process.env.NODE_ENV === 'production' ? 'https://api.medmeeting.com/v1' : 'https://test.medmeeting.com/v1'
let toast = false
let timer
let requestList = []
function timeout () {
  clearTimeout(timer)
  toast = true
  timer = setTimeout(() => {
    toast = false
  }, 3000)
}
var time
function closeLoading () {
  clearTimeout(time)
  if (requestList.length) requestList.length--
  time = setTimeout(() => {
    if (requestList.length === 0) {
      store.commit('loadMoreLoading', false)
      store.commit('loading', false)
    }
  }, 300)
}
function request () {
  let method = arguments[0].method
  let url = arguments[1]
  let data = arguments[2] || null
  let control = null
  let loading = false
  if (arguments[3]) {
    control = arguments[3].control
    loading = arguments[3].loading
  }
  !toast && loading && wx.showLoading({
    mask: true,
    title: '加载中' // 数据请求前loading，提高用户体验
  })
  store.commit('loadMoreLoading', true)
  requestList.push(url)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url.indexOf('http') > -1 ? url : baseurl + url,
      data: data,
      dataType: 'json',
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json',
        'Authorization': store.state.token ? 'Bearer_' + store.state.token : ''
      }, // 设置请求的 header
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '网络出错，稍后再试',
            icon: 'none'
          })
          timeout()
          return false
        }
        if (!control) {
          if (res.data.errorCode !== '200') {
            timeout()
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
            // resolve(res.data)
          } else {
            resolve(res.data)
          }
        } else {
          resolve(res.data)
        }
      },
      fail: function (error) {
        wx.hideLoading()
        reject(error) // 请求失败
      },
      complete: function () {
        closeLoading(url)
      }
    })
  })
}
const http = {
  get (url, data) {
    return request.apply(this, [{method: 'GET'}, ...arguments])
  },
  post (url, data) {
    return request.apply(this, [{method: 'POST'}, ...arguments])
  }
}

export default http // 暴露出来供其他文件引用
