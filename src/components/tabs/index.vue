<template>
<div class="tabSwitch">
  <div class="videoDetailTab">
    <div class="tab" @click='handleChange(index)' :class="{'current':tabIndex===index}" v-for='(item, index) in navList' :key='index'>
      {{item.label}}
    </div>
    <div class="bottomline" :class="duration!=0?'transition':''" v-if='navList.length' :style='{"transform":"translateX("+left+")","width":1/navList.length*100+"%"}'></div>
  </div>
    <swiper
      :duration="duration"
      :style="{'height':swiperHeight}"
      @change='swiperChange'
      :current='tabIndex'
    >
       <slot></slot>
    </swiper>
</div>
</template>
<script>
import { debounce } from '@/utils'
export default {
  data () {
    return {
      tabIndex: 0,
      width: 0,
      navList: [],
      paneList: [],
      tabValue: '',
      duration: 0
    }
  },
  props: {
    height: {
      type: [Number, String],
      default: '100vh'
    },
    value: {
      type: [Number, String]
    }
  },
  computed: {
    swiperHeight () {
      return `calc(${this.height} - 90rpx)`
    },
    left () {
      return this.width * this.tabIndex + 'px'
    }
  },
  methods: {
    touchmove (e) {
      console.log(e)
    },
    handleChange (index) {
      this.tabIndex = index
    },
    swiperChange (e) {
      this.tabIndex = e.target.current
      this.$emit('input', this.navList[this.tabIndex].name)
    },
    getTabs () {
      return this.$children.filter((item) => {
        return item.$options.name === 'pane'
      })
    },
    updateNav: debounce(10, false, function () {
      this.navList = []
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          label: pane.label,
          name: pane.name || index
        })
        if (!this.tabIndexC) {
          if (!pane.name && this.value === index) {
            this.tabIndex = index
          }
          if (this.name && this.value === pane.name) {
            this.tabIndex = index
          }
        }
      })
      this.width = this.winWidth / this.navList.length
      this.duration = 300
    })
  },
  onUnload () {
    this.tabIndex = this.tabIndexC
  },
  onLoad () {
    this.winWidth = wx.getSystemInfoSync().windowWidth
    this.duration = 0
  }
}
</script>
<style lang="less" scoped>
  .transition{
    transition: all .3s;
  }
  .tabSwitch{
    position: relative;
    .videoDetailTab{
      display: flex;
      box-shadow: 0px 4px 20px  #e8f2fb;
      height: 90px;
      line-height: 90px;
      position: relative;
      .tab{
        flex: 1;
        text-align: center;
        color: #8b8fa0;
        font-size: 28px;
        // border-bottom: 1px solid #8b8fa0;
        &.current{
          color: #0078ff;
          position: relative;
        }
      }

      .bottomline {
        position: absolute;
        top: 100%;
        transform: translateX(0);
        height: 0px;
        &::after{
          display: inline-block;
          content: '';
          width: 60px;
          height: 4px;
          border-radius: 2px;
          background: #0078ff;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%)
        }
      }

    }
    .swipe{
      height: calc(100vh - 422px - 100px);
    }
    .swipeDiscount{
      height: calc(100vh - 422px - 100px - 110px);
    }
  }
</style>
