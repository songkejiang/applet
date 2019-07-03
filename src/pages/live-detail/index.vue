<template>
  <div class="videoDetail" v-if='liveDetails.id'>
    <div class="videoplayer">
        <player ref='player' :info='liveDetails'  @play="onplay"></player>
    </div>
    <div class="tabWrap">
      <tab-switch :height='height' v-model="defaultIndex">
        <!-- <pane label='互动'>
          <live-chat  :info='liveDetails'></live-chat>
        </pane> -->
        <pane label='介绍' >
          <live-content  :info='liveDetails'></live-content>
        </pane>
        <pane label='相关视频'>
          <live-preview ref="livePreview"  :info='liveDetails'></live-preview>
        </pane>
      </tab-switch>
    </div>
    <pay-footer @success='paySuccess'  v-if="liveDetails.chargeType=='yes' && liveDetails.payFalg!==1" type='live' @failed='payFail'  :info='liveDetails'></pay-footer>
  </div>
  <div v-else class="invalidImgWrap">
    <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
  </div>
</template>
<script>
import player from '@/components/live-player'
import mtScrollView from '@/components/mt-scroll-view'
import tabSwitch from '@/components/tabs'
import Pane from '@/components/tabs/pane'
import payFooter from '@/components/pay-footer'
import { mapActions } from 'vuex'
// import LiveChat from './live-chat'
import LiveContent from './live-content'
import LivePreview from './live-preview'
export default {
  components: {
    player,
    tabSwitch,
    Pane,
    payFooter,
    LiveContent,
    LivePreview,
    mtScrollView
  },
  data () {
    return {
      defaultIndex: 0
    }
  },
  computed: {
    login () {
      return this.$store.state.token
    },
    liveDetails () {
      if (this.$store.state.liveDetails) {
        let entity = Object.assign({}, this.$store.state.liveDetails.entity)
        entity.startTime = this.$formateDate('yyyy-MM-dd hh:mm', entity.startTime)
        console.log(entity)
        return entity
      }
      return {}
    },
    coupons () {
      return this.$store.state.couponList
    },
    height () {
      if (this.liveDetails.chargeType === 'yes' && this.liveDetails.payFalg !== 1) {
        if (this.liveDetails.isDiscount && this.liveDetails.discountEndTime > Date.now()) {
          return '100vh - 422rpx - 100rpx - 110rpx'
        }
        return '100vh - 422rpx - 100rpx'
      }
      return '100vh - 422rpx'
    }
  },
  methods: {
    ...mapActions([
      'getLiveDetails',
      'getHeadVideo'
    ]),
    onplay () {
      if (this.liveDetails.chargeType === 'yes' && !this.liveDetails.payFalg) {
        wx.showToast({
          title: '付费后观看',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.liveDetails.isShare && !this.liveDetails.shareRecord) {
        wx.showToast({
          title: '分享后才可以观看哦',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.liveDetails.liveStatus === 'ready') {
        wx.showToast({
          title: '主播正在准备中',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.$refs.player && this.$refs.player.play()
    },
    paySuccess () {
      this.getLiveDetails({
        videoId: this.videoId
      })
    },
    getData () {
      this.getHeadVideo()
      this.getLiveDetails({
        videoId: this.videoId
      }).then(res => {
        if (res) {
          setTimeout(() => {
            this.$refs.livePreview.getData(res)
            wx.setNavigationBarTitle({
              title: res.title
            })
          }, 300)
        }
      })
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(this.videoId)
    return {
      title: this.liveDetails.shareTitle,
      path: '/pages/live-detail/main?videoId=' + this.videoId,
      imageUrl: this.liveDetails.shareImage
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
    this.$store.commit({
      type: 'SETLIVEDETAILS',
      liveDetails: ''
    })
    this.$store.commit('loading', true)
    this.defaultIndex = 0
    this.videoId = options.videoId
    console.log('videoId', this.videoId)
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
      // position: fixed;
      // width: 100%;
      // top: 0;
      // left: 0;
    }
    .tabWrap{
      // position: fixed;
      // width: 100%;
      // top: 422px;
      // left: 0;
    }
  }
</style>
