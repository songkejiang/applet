<template>
<div>
  <div class="tabbar" :style="{'padding-top': padtop}">
    <span class="back" @click='goback'>
      <img src="/static/images/arrow.png" alt="">
    </span>
    <span class="tab" :class="{current:living}" @click='living=true'>
      直播
    </span>
    <span class="tab" @click='living=false' :class="{current:!living}">
      回播
    </span>
  </div>
  <div v-show='living'>
    <living :padtop='padtop'></living>
  </div>
  <div v-show="!living">
    <history-video :padtop='padtop'></history-video>
  </div>
</div>
</template>
<script>
import living from './living'
import historyVideo from './historyVideo'
export default {
  components: {
    living,
    historyVideo
  },
  data () {
    return {
      living: true,
      padtop: '45rpx'
    }
  },
  methods: {
    goback () {
      wx.navigateBack()
    }
  },
  onLoad () {
   var data = wx.getMenuButtonBoundingClientRect()
   this.padtop = data.top * 2 + 'rpx'
  }
}
</script>
<style scoped lang='less'>
    .tabbar{
      padding-top: 44px;
      line-height: 75px;
      background: #fff;
      z-index: 1000;
      text-align: center;
      position: relative;
      .tab{
        width: 150px;
        display: inline-block;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        &.current{
          color: #1c90fe
        }
      }
      .back{
        position: absolute;
        width: 50px;
        left: 0;
        height: 50px;
        line-height: 50px;
        padding: 20px 0 0 20px;
        img{
          width: 60%;
          height: 60%;
        }
      }
    }
   </style>
