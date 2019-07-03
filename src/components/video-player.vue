<template>
  <div style="font-size:0;">
    <div class="controls"  v-show='showCoverView || !videoSource'>
      <img :src="info.coverPhoto" class="img"  alt="" mode='aspectFill'>
      <img src="/static/images/play.png" class="play" @click='handlePlayClick'  v-show='showPlay'  alt="">
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
      headType: 'VIDEO'
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
      return this.info.url ? this.info.url : null
    },
    headVideoSource () {
      return this.$store.state.headVideoInfo ? this.$store.state.headVideoInfo.url : ''
    }
  },
  watch: {
    info (newVal) {
      console.log(newVal)
      this.showCoverPhoto = true
      this.showPlay = true
      this.showPause = false
      this.showCoverView = true
      this.headVideoEnd = false
      this.remaintime = 0
    }
  },
  methods: {
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
    }
  },
  onLoad () {
    this.headVideoContext = wx.createVideoContext('myHeadVideo')
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
