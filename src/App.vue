<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
    // if (this.$store.state.openId) return
    // console.log(this.$store)
    // wx.login({
    //   // 获取code
    //   success: (res) => {
    //     console.log(res)
    //     this.code = res.code // 返回code
    //     this.$http.get('/website/wechat/small/getOpenId', {
    //       code: this.code
    //     }, {loading: false})
    //       .then((res) => {
    //         console.log(res.entity)
    //         this.$store.commit({
    //           type: 'SET_OPEN_ID',
    //           openId: res.entity
    //         })
    //       })
    //   }
    // })
  },
  log () {
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
  box-sizing: border-box;
} */
input {
  border:1px solid #d4d4d4;
  padding: 4px;
  box-sizing: border-box
}
button {
  border:1px solid #d4d4d4;
  box-sizing: border-box;
  outline: none
}
button::after{ border: none; }
</style>
