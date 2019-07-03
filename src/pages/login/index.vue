<template>
    <div class="login">
      <div class="mobile_wrap" >
          <input placeholder-class='placeholder' type="number" placeholder="请输入手机号码"  v-model='mobile'>
      </div>
      <div class="mobile_wrap" >
          <input placeholder-class='placeholder' type="number" placeholder="输入短信验证码" v-model='code'>
          <button  @click='getCode' >获取验证码{{!isDisabled?'':remainTime}}</button>
      </div>
      <div class="yyCode">没有收到？获取<span class="getYycode" @click="getInvoiceCode">语音验证码</span>
      </div>
      <button class="login_btn"    @click="login">登录</button>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        mobile: '',
        code: '',
        isDisabled: false,
        remainTime: 30
      }
    },
    methods: {
      countDown () {
        this.timer = setInterval(() => {
          if (this.remainTime <= 1) {
            clearInterval(this.timer)
            this.isDisabled = false
            this.remainTime = 30
          }
          this.remainTime--
        }, 1000)
      },
      getCode () {
        if (this.isDisabled) return
        if (!this.mobile) {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (this.mobile.length !== 11) {
          wx.showToast({
            title: '手机号格式有误',
            icon: 'none',
            duration: 2000
          })
          return
        }
        this.$http
          .get('/msgs/codes', {
            phone: this.mobile
          })
          .then(res => {
            if (res.errorCode === '200') {
              this.isDisabled = true
              this.countDown()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
      },
      getInvoiceCode () {
        if (this.isDisabled) return
        if (!this.mobile) {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (this.mobile.length !== 11) {
          wx.showToast({
            title: '手机号格式有误',
            icon: 'none',
            duration: 2000
          })
          return
        }
        this.$http.get('/token/phoneCodeNoPhoto', {
          phone: this.mobile
        }).then(res => {
          if (res.errorCode === '200') {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      login () {
        if (!this.mobile) {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (this.mobile.length !== 11) {
          return wx.showToast({
              title: '手机号码格式不正确',
              icon: 'none',
              duration: 2000
            })
        }
        if (this.code.length !== 4) {
          return wx.showToast({
              title: '验证码格式不正确',
              icon: 'none',
              duration: 2000
            })
        }
        this.$http
          .get('/oauth/token', {
            phone: this.mobile,
            code: this.code,
            source: 'mobile',
            webAuthenType: 'applet'
          })
          .then(res => {
            if (res.errorCode === '200') {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              this.$store.commit('SET_USERINFO', res.extra)
              this.$store.commit('SET_TOKEN', res.entity.accessToken)
              wx.navigateBack()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
      }
    },
    onLoad (options) {
      if (options.from) {
        this.$store.commit({
          type: 'PAGE_ORIGIN',
          ORIGIN: options.from
        })
      }
    }
  }
  </script>
<style>
.placeholder{
  font-size: 30px
}
</style>

  <style lang='less'>
  .login {
    /* display: flex; */
    padding: 0 30px;
    padding-top:150px;
    .mobile_wrap{
      display: flex;
      height: 80px;
      // border-radius: 40px;
      overflow: hidden;
      border-bottom:.5px solid #d4d4d4;
      margin-bottom: 30px;
      .text {
        font-size: 30px;
        line-height: 80px;
        padding-left: 30px;
        text-align: left;
        white-space: nowrap;
      }
    }
    .mobile_wrap input{
      height: 100%;
      flex-grow: 1;
      border:none;
      padding: 10px 30px;
    }
    .mobile_wrap button {
      background: #fff;
      border-radius: 0;
      color: #fff;
      font-size: 28px;
      line-height: 80px;
      border: none;
      white-space: nowrap;
      width: 240px;
      padding: 0 20px;
      color: rgb(48, 148, 250);
      &.disable {
        // color: #cdcdcd;
        opacity: .6;
      }
    }
    .login_btn {
      background: linear-gradient( -90deg, #00c6fb, #005bea);
      color: #fff;
      font-size: 30px;
      line-height: 80px;
      border: none;
      width: 100%;
      padding: 0 20px;
      border-radius: 40px;
      &.disable{
        // background: #108ee9;
        opacity: .6;
        color: #fff;
      }
    }
    .yyCode{
      text-align: right;
      padding: 20px 0;
      font-size: 26px;
      margin-top: -20px;
      margin-bottom: 30px;
      .getYycode{
        color: rgb(48, 148, 250);
      }
    }
  }
  </style>
