/**
 * 测试appid wxf89d5b30a2a94598
 * 生产appid wx3e5fddf6a70c254b
 *  */
import Vue from 'vue'
import App from './App'
import http from '@/utils/http.js'
import formateDate from '@/utils/formateDate.js'
import qiniu from '@/utils/QiNiuPicModify.js'
import store from '@/store'
Vue.config.productionTip = false
Vue.prototype.$http = http
App.mpType = 'app'
const app = new Vue(App)
Vue.prototype.$formateDate = formateDate
Vue.prototype.$store = store
Vue.prototype.qiniu = qiniu
app.$mount()
Vue.prototype.globalData = getApp().globalData
if (!app.$store.state.openId) {
  wx.login({
    // 获取code
    success: (res) => {
      app.code = res.code // 返回code
      app.$http.get('/website/wechat/small/getOpenId', {
        code: app.code
      }, {loading: false})
        .then((res) => {
          app.$store.commit('SET_OPEN_ID', res.entity)
        })
    }
  })
}
