<template>
  <div style="font-size:0;">
    <div class="controls"  v-if="(info.liveStatus=='play'||info.liveStatus=='ready') && showCoverView || !videoSource">
      <img :src="info.coverPhoto" class="img"  alt="" mode='aspectFill'>
      <img src="/static/images/play.png" class="play" @click='handlePlayClick'  v-show='showPlay'  alt="">
      <div class="countdown" v-if='remaintime2>0'><span>{{day}}</span>天<span>{{h}}</span>小时<span>{{m}}</span>分<span>{{s}}</span>秒</div>
    </div>
    <div class="playstatus"  v-if="videoSource && info.liveStatus&&info.liveStatus!=='play'&&info.liveStatus!=='ready'">
      <div v-if="info.liveStatus=='leave'||info.liveStatus=='wait'" class="wrap">
        <img class="img"  src="/static/images/play-wait.png"/>
        <div>主播离开啦</div>
      </div>
      <div v-if="info.liveStatus =='end'"  class="wrap">
        <img class="img"  src="/static/images/play-end.png"/>
        <div>直播已结束</div>
      </div>
    </div>
    <video id='myHeadVideo'
      v-if="headVideoSource && !headVideoEnd && headType === 'VIDEO' && videoSource && !showCoverView"
      v-show='!showCoverView'
      class="video"
      :show-fullscreen-btn="false"
      :show-center-play-btn='false'
      :src="headVideoSource"
      :controls = "false"
      @ended="playend"
      @timeupdate='timeupdate'
      >
       <cover-view v-if='remaintime>0&&!headVideoEnd'>
         <cover-view class="remaintime">
           剩余{{remaintime}}秒
         </cover-view>
       </cover-view>
    </video>
    <div class="headImage"
      v-if="headType === 'IMAGE' && headVideoSource && !showCoverView && !headVideoEnd "
    >
      <img :src="headVideoSource" alt="" mode='aspectFill'>
      <div class="remaintime">
        剩余{{remaintime}}秒
      </div>
    </div>
    <video id='myVideo'
      v-if='videoSource && !showCoverView && headVideoEnd'
      class="video"
      autoplay
      :show-center-play-btn='false'
      :src="videoSource"
      @timeupdate='liveupdate'
      @play='liveplay'
      @waiting='livewait'
      >
    </video>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      default: {},
      type: Object
    }
  },
  data () {
    return {
      showCoverPhoto: true,
      showPlay: true,
      showPause: false,
      showCoverView: true,
      headVideoEnd: false,
      remaintime: 0,
      headType: 'VIDEO',
      leave: false,
      day: '',
      h: '',
      m: '',
      s: '',
      remaintime2: 0
    }
  },
  computed: {
    headVideoInfo () {
      if (this.$store.state.headVideoInfo) {
        this.headType = this.$store.state.headVideoInfo.type
        return this.$store.state.headVideoInfo
      }
      return ''
    },
    videoSource () {
      return this.info.hlsPlayUrl ? this.info.hlsPlayUrl : null
    },
    headVideoSource () {
      return this.$store.state.headVideoInfo ? this.$store.state.headVideoInfo.url : ''
    }
  },
  methods: {
    countDown () {
      var _this = this
      var t = this.info.endTime - Date.now() // 时间差
      this.remaintime2 = t
      var d = 0
      var h = 0
      var m = 0
      var s = 0
      function count (t) {
        if (t >= 0) {
          d = Math.floor(t / 1000 / 3600 / 24)
          h = Math.floor((t / 1000 / 60 / 60) % 24)
          m = Math.floor((t / 1000 / 60) % 60)
          s = Math.floor((t / 1000) % 60)
        } else {
          clearInterval(_this.timer2)
        }
        _this.day = d
        _this.h = h >= 10 ? h : '0' + h
        _this.m = m >= 10 ? m : '0' + m
        _this.s = s >= 10 ? s : '0' + s
      }
      count(t)
      this.timer2 = setInterval(() => {
        t -= 1000
        this.remaintime2 = t
        count(t)
      }, 1000)
    },
    handlePlayClick () {
      this.$emit('play')
    },
    handlePauseClick () {
      this.$emit('pause')
    },
    play () {
      this.showCoverView = false
      if (this.headVideoInfo && this.headVideoInfo.isHead && this.videoSource) {
        if (this.headVideoInfo.type === 'VIDEO') {
          setTimeout(() => {
            this.headVideoContext = wx.createVideoContext('myHeadVideo')
            this.headVideoContext.play()
          }, 400)
        } else {
          this.remaintime = 5
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            if (this.remaintime <= 0) {
              this.headVideoEnd = true
              setTimeout(() => {
                this.videoContext = wx.createVideoContext('myVideo')
                this.videoContext.pause()
                this.videoContext.play()
              }, 400)
              clearInterval(this.timer)
              return
            }
            this.remaintime--
          }, 1000)
        }
      }
      if (!this.headVideoInfo) {
        this.headVideoEnd = true
        setTimeout(() => {
          this.videoContext = wx.createVideoContext('myVideo')
          this.videoContext.play()
        }, 300)
      }
    },
    pause () {
      this.videoContext = wx.createVideoContext('myVideo')
      this.videoContext.pause()
    },
    playend () {
      this.headVideoEnd = true
      setTimeout(() => {
        this.videoContext = wx.createVideoContext('myVideo')
        this.videoContext.pause()
        this.videoContext.play()
      }, 400)
    },
    timeupdate (e) {
      if (this.headVideoEnd || this.remaintime) return
      this.remaintime = parseInt(e.target.duration)
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.remaintime <= 0) clearInterval(this.timer)
        this.remaintime--
      }, 1000)
    },
    error (e) {
    },
    liveupdate (e) {
    },
    liveplay (e) {
      clearTimeout(this.playtime)
    },
    livewait (e) {
      // let _this = this
      // wx.getNetworkType({
      //   success (res) {
      //     console.log(res)
      //     if (res.networkType !== 'none') {
      //       _this.playtime = setTimeout(() => {
      //         // _this.$emit('fresh')
      //       }, 5000)
      //     }
      //   }
      // })
    }
  },
  onLoad () {
    this.showCoverPhoto = true
    this.showPlay = true
    this.showPause = false
    this.showCoverView = true
    this.headVideoEnd = false
    this.remaintime = 0
    this.headVideoContext = wx.createVideoContext('myHeadVideo')
    this.countDown()
    wx.onNetworkStatusChange((res) => {
      if (res.isConnected) {
        this.videoContext.play()
      } else {
        this.videoContext.pause()
        wx.showToast({
          title: '网络已断开',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  created () {
  }
}
</script>
<style lang='less' scoped>
  .video{
    width: 100%;
    background: #fff;
    height: 422px;
  }
  .countdown{
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    color: #fff;
    text-align: center;
    font-size: 28px;
    line-height: 60px;
    span{
      width: 40px;
      display: inline-block;
    }
  }
  .playstatus{
    width: 100%;
    position: relative;
    /* top: 50%; */
    height: 422px;
    /* margin-top: -25px; */
    display: flex;
    background: #000;
    justify-content: center;
    align-items: center;
    color: #fff;
    .wrap{
      text-align: center;
      font-size: 24px;
    }
    .img{
      width: 100px;
      height: 100px;
    }
  }
  .controls {
    position: relative;
    /* top: 50%; */
    height: 422px;
    /* margin-top: -25px; */
    background: #fff;
    .img{
      width: 100%;
      height: 422px;
    }
  }
  .headImage{
    width: 100%;
    height: 422px;
    position: relative;
    img{
      width: 100%;
      height: 422px;
    }
    .remaintime{
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
  .pause, .play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    z-index: 1000;
  }
  .play {
    width: 90px;
    height: 90px;
  }
  .remaintime{
    font-size: 20px;
    color: #0078ff;
    float: right;
    height: 40px;
    line-height: 40px;
    width: 130px;
    border-radius: 25px;
    border: 1px solid #0078ff;
    box-sizing: border-box;
    text-align: center
  }
</style>
