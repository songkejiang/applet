<template>
  <scroll-view  style="height: 100%">
    <div class="show_wrap">
      <div class="app-active">
        <p v-html="text"></p>
        <span @click='jump' class="btn">点击前往</span>
      </div>
    </div>
  </scroll-view>
</template>
<script>
  export default {
    data () {
      return {
        text: ''
      }
    },
    props: {
      info: Object,
      scrollHeight: {
        default: 0,
        type: Number
      }
    },
    methods: {
      jump () {
       wx.navigateTo({
        url: '/pages/dl/main'
      })
      }
    },
    onLoad () {
      if (this.info.programType === 'VIP') {
        this.text = '前往<span style="color: #0078FF">医会宝App</span><br/>与直播大咖实时互动'
        this.url = 'https://mobile.medmeeting.com/#/downloadAPP?channelCode=dkhd'
      } else {
        this.text = '前往<span style="color: #0078FF">医会宝App</span><br/>参与会议直播实时互动'
        this.url = 'https://mobile.medmeeting.com/#/downloadAPP?channelCode=hyhd'
      }
    }
  }
</script>
<style lang="less">
  .show_wrap{
    display: flex;
    align-items: center;
    height: 100%;
    background: #F4F5F9;
    .app-active{
      width: 70%;
      margin: 0 auto;
      background: #fff;
      text-align: center;
      padding: 40px 0;
      border-radius: 10px;
      p{
        font-size: 34px;
      }
    }
  }
  .show_wrap .btn{
    display: inline-block;
    padding: 6px 0;
    width: 80%;
    margin: 0 50px;
    color:#fff;
    text-align: center;
    flex: 1;
    /* height: 20px; */
    background-image: linear-gradient(45deg, #06A7FE 0%, #5059FE 100%);
    border-radius: 100px;
    margin-top: 32px;
  }
</style>
