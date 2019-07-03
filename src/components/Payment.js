/**
 * paytype 直播 live  视频 video 系列课程 series
 * id 直播ID 视频id 系列课程id
 */
import Vue from 'vue'
export default class Payment extends Vue {
  constructor (type, id) {
    super()
    this.id = id
    this.type = type
  }
  pay () {
    if (this.type === 'live') {
      return this.livePay()
    }
    if (this.type === 'video') {
      return this.videoPay()
    }
    if (this.type === 'series') {
      return this.seriesPay()
    }
  }
  async livePay () {
    try {
      let res = await this.$http.post('/liveProgram/livePay',
        {
          couponUserId: this.$store.state.couponId,
          openId: this.$store.state.openId,
          paymentChannel: 'WXPAY',
          platformType: 'SMALL',
          programId: this.id
        })
      /*eslint-disable */
      return new Promise((resolve, reject) => {
        if (res.errorCode === '200') {
          if (res.entity.zero) {
            resolve()
          } else {
            wx.requestPayment({
              timeStamp: res.entity.requestPay.timeStamp,
              nonceStr: res.entity.requestPay.nonceStr,
              package: res.entity.requestPay.package,
              signType: res.entity.requestPay.signType,
              paySign: res.entity.requestPay.paySign,
              success(r) {
                resolve(r)
              },
              fail(f) {
                reject(f)
              }
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
        })
    } catch (e) {
      console.log(e)
    }
  }
  async seriesPay () {
    try {
      let res = await this.$http.post('/liveVideoPay/E/firstBuyVideo',
        {
          couponUserId: this.$store.state.couponId,
          openId: this.$store.state.openId,
          paymentChannel: 'WXPAY',
          platformType: 'SMALL',
          serverId: this.id
        })
      /*eslint-disable */
      return new Promise((resolve, reject) => {
        if (res.errorCode === '200') {
          if (res.entity.zero) {
            resolve()
          } else {
            wx.requestPayment({
              timeStamp: res.entity.requestPay.timeStamp,
              nonceStr: res.entity.requestPay.nonceStr,
              package: res.entity.requestPay.package,
              signType: res.entity.requestPay.signType,
              paySign: res.entity.requestPay.paySign,
              success(r) {
                resolve(r)
              },
              fail(f) {
                reject(f)
              }
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
        })
    } catch (e) {
      console.log(e)
    }
  }
  async videoPay () {
    try {
      let res = await this.$http.post('/liveVideoPay/C/firstBuyVideo',
        {
          couponUserId: this.$store.state.couponId,
          openId: this.$store.state.openId,
          paymentChannel: 'WXPAY',
          platformType: 'SMALL',
          serverId: this.id
        })
      /*eslint-disable */
      return new Promise((resolve, reject) => {
        if (res.errorCode === '200') {
          if (res.entity.zero) {
            resolve()
          } else {
            wx.requestPayment({
              timeStamp: res.entity.requestPay.timeStamp,
              nonceStr: res.entity.requestPay.nonceStr,
              package: res.entity.requestPay.package,
              signType: res.entity.requestPay.signType,
              paySign: res.entity.requestPay.paySign,
              success(r) {
                resolve(r)
              },
              fail(f) {
                reject(f)
              }
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
        }
        })
    } catch (e) {
      console.log(e)
    }
  }
}
