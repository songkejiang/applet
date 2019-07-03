<template>
  <div class="videoDetail" v-if='videoDetails.videoId'>
    <div class="videoplayer">
        <player ref='player' :info='videoDetails' @play="onplay"></player>
    </div>
    <discount :info='videoDetails'></discount>
    <div class="tabWrap">
      <tab-switch :height='height'>
        <pane label='简介'>
          <video-content  :info='videoDetails'></video-content>
        </pane>
        <pane label='相关视频'>
          <video-preview ref='videoPreview'></video-preview>
        </pane>
        <pane label='评论'>
          <video-comment ref='videoComment' ></video-comment>
        </pane>
      </tab-switch>
    </div>
    <pay-footer ref="payFooter" v-if="videoDetails.chargeType=='yes' && !videoDetails.payFlag" type='video' @success='paySuccess'  :info='videoDetails'></pay-footer>
  </div>
  <div v-else class="invalidImgWrap">
    <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
  </div>
</template>
<script>
import player from '@/components/video-player'
import tabSwitch from '@/components/tabs'
import Pane from '@/components/tabs/pane'
import payFooter from '@/components/pay-footer'
import VideoContent from './video-content'
import VideoPreview from './video-preview'
import VideoComment from './video-comment'
import discount from '@/components/discount'
import { mapActions } from 'vuex'
import mtScrollView from '@/components/mt-scroll-view'
export default {
  components: {
    player,
    tabSwitch,
    payFooter,
    VideoContent,
    VideoPreview,
    VideoComment,
    Pane,
    discount,
    mtScrollView
  },
  data () {
    return {
      tabIndex: 0
    }
  },
  computed: {
    login () {
      return this.$store.state.token
    },
    videoDetails () {
      return this.$store.state.videoDetails ? this.$store.state.videoDetails.entity : {}
    },
    height () {
      if (this.videoDetails.chargeType === 'yes' && !this.videoDetails.payFlag) {
        if (this.videoDetails.isDiscount && this.videoDetails.discountEndTime > Date.now()) {
          return '100vh - 422rpx - 100rpx - 110rpx'
        }
        return '100vh - 422rpx - 100rpx'
      }
      return '100vh - 422rpx'
    }
  },
  methods: {
    ...mapActions([
      'getVideoDetails',
      'getHeadVideo'
    ]),
    onplay () {
      if (this.videoDetails.chargeType === 'yes' && !this.videoDetails.payFlag) {
        wx.showToast({
          title: '付费后观看',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.videoDetails.isShare && !this.videoDetails.shareRecord) {
        wx.showToast({
          title: '分享后才可以观看哦',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.$refs.player && this.$refs.player.play()
    },
    paySuccess () {
      this.getData()
    },
    onShare () {
      this.$http.post(`/app/shareRecord/insert`, {
        objectId: this.videoId,
        type: 'VIDEO'
      }).then((res) => {
        if (res.errorCode === '200') {
          this.getData()
        }
      })
    },
    getData () {
      this.videoId = this.videoId
      this.getVideoDetails({
        videoId: this.videoId
      }).then((res) => {
        if (res) {
          wx.setNavigationBarTitle({
            title: res.title
          })
          setTimeout(() => {
            this.$refs.videoPreview.getData(res)
            this.$refs.videoComment.getData(res)
          }, 300)
        }
      })
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.onShare()
    return {
      title: this.videoDetails.shareTitle,
      path: '/pages/video-detail/main?videoId=' + this.videoId,
      imageUrl: this.videoDetails.shareImage
    }
  },
  onShow () {
    if (this.$store.state.from === 'login') {
      this.getData()
      this.$store.commit({
        type: 'PAGE_ORIGIN',
        ORIGIN: ''
      })
    }
  },
  onLoad (options) {
    this.getHeadVideo()
    this.$store.commit({
      type: 'SETVIDEODETAILS',
      videoDetails: ''
    })
    this.$store.commit('loading', true)
    this.videoId = options.videoId
    this.getData()
  }
}
</script>
<style lang='less' scoped>
  .invalidImgWrap{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    background: #fff;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    img{
      width: 35%;
      margin-top: -20px;
      margin-bottom: 20px;
    }
  }
  .videoDetail{
    .videoplayer{
    }
    .discount{
      height: 110px;
      background-image: url(http://store-pic.medmeeting.com/FmFhPXJhh1z0LZ1zS0I5851i2b3c);
      background-size: cover;
      background-repeat: no-repeat;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        display: flex;
        .newprice{
          font-size: 50px;
          display: flex;
          align-items: center;
          margin-left: 30px;
          margin-right: 30px;
        }
        .text{
          font-size: 22px;
          background: #fff;
          padding: 4px;
          border-radius: 5px;
          line-height: 1em;
          color: #0078ff;
          margin-top: 10px;
        }
        .oldprice{
          text-decoration: line-through;
          font-size: 28px;
        }
      }
      .right {
        font-size: 26px;
        color: #333;
        padding-right: 10px;
        .num{
          padding: 4px 6px;
          margin: 0 4px;
          border-radius: 10px;
          background: #62ADFF;
          color: #fff;
        }
      }
    }
    .tabWrap{
      // position: fixed;
      // width: 100%;
      // top: 422px;
      // left: 0;
    }
  }
</style>
