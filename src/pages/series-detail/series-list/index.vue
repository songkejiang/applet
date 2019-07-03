<template>
  <scroll-view scroll-y style="height: 100%" class="video_series">
    <ul class="series">
      <li class='series_item' v-for='(program, index) in videoList' :key='index'  @click="changeVideo(program, index)">
        <div class="order">
          <img :src="index === playIndex ? '/static/images/play-select.png' : '/static/images/play.png'" alt="">
        </div>
        <div class="content">
          <p>{{program.title}}</p>
          <p class='time'>{{program.timeSecond}}</p>
        </div>
        <div class="review" v-if="program.isSee&&info.chargeType === 'yes'&& !info.payFlag">
          <span>试看</span>
        </div>
      </li>
    </ul>
  </scroll-view>
</template>
<script>
  export default {
    data () {
      return {
        playIndex: ''
      }
    },
    props: {
      info: {
        default: {},
        type: Object
      }
    },
    computed: {
      videoList () {
        if (!this.info.videoList) return []
        return this.info.videoList.map((item) => {
          if (typeof item.timeSecond === 'number') {
            item.timeSecond = parseInt(item.timeSecond / 3600) + ':' + parseInt(item.timeSecond % 3600 / 60) + ':' + parseInt(item.timeSecond % 60)
          }
          return item
        })
      }
    },
    methods: {
      changeVideo (info, index) {
        if (this.info.chargeType === 'yes' && !this.info.payFlag && !info.isSee) {
          wx.showToast({
            title: '付费后观看',
            icon: 'none',
            duration: 2000
          })
          return
        }
        this.playIndex = index
        let {isSee, url, videoId} = info
        this.$emit('selectSeries', {isSee, url, videoId}, this.playIndex)
      }
    },
    onLoad () {
      let {isSee, url, videoId} = this.info.videoList[0]
      this.$emit('selectSeries', {isSee, url, videoId})
    }
  }
</script>
<style lang='less'>
  .video_series {
    height: 100%;
    .title {
      padding: 16px 20px;
      font-size: 28px;
      border-bottom: 2px solid #e5e5e5;
    }
    .series_item {
      margin: 0 40px;
      padding: 32px 0;
      display: flex;
      font-size: 26px;
      border-bottom: 2px solid #e5e5e5;
      .order {
        margin: auto;
        font-size: 32px;
        color: #3094fa;
        img{
          width: 40px;
          height: 40px;
        }
      }
      .content {
        flex: 1;
        padding: 0 20px;
        font-size: 28px;
        .time {
          color: #ccc;
          font-size: 24px;
        }
      }
      .review {
        margin: auto;
        span {
          padding: 3px 10px;
          background: linear-gradient(-90deg, #00c5fb, #005cea);
          border-radius: 40px;
          color: #fff;
          font-size: 24px;
        }
      }
    }
  }
</style>
