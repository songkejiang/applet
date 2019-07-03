export default {
  methods: {
    jumpPage (v) {
      wx.navigateTo({
        url: v
      })
      // if (!this.$store.state.token) {
      //   wx.navigateTo({
      //     url: '/pages/login/main'
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: v
      //   })
      // }
    }
  }
}
