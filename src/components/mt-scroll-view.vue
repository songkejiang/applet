<template>
 <scroll-view
    v-if = 'IOS'
    scroll-y
    class="mtScrollview"
    :scroll-into-view='intoViewId'
    :style="{'height':scrollViewHeight}"
    @touchstart='touchstart'
    @touchmove.stop='touchmove'
    @touchend='touchend'
    @scroll="scroll"
    @scrolltolower = 'scrolltolower'
  >
  <div class="freshIconWrap" v-if='fresh'   @animationend='animationend' :animation='animationData'  :class="animateClass" >
    <img src="/static/images/rotate.png" mode='widthFix' class="freshIcon" alt="">
  </div>
  <slot></slot>
  <load-more ref='loadmore' v-if='loadMore'  :listLen='listLen'  :totalPages='totalPages' :pageNum='pageNum' @load='$emit("load")'></load-more>
  <template v-if='showInvalidPic'>
    <div v-if='listLen === 0 && !loading'  class="invalidImgWrap" :style="{'height':scrollViewHeight}">
      <img src="/static/images/no-schedule.png" alt=""  mode='widthFix'>
      <span>亲，还没有内容哦～</span>
    </div>
    <div v-if='loading' class="invalidImgWrap" :style="{'height':scrollViewHeight}"  @touchmove.prevent.stop>
      <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
    </div>
  </template>
  <div  @touchmove.prevent.stop class="cover"  v-if='isFreshing'></div>
</scroll-view>
  <scroll-view
    v-else
    scroll-y
    class="mtScrollview"
    :scroll-into-view='intoViewId'
    :style="{'height':scrollViewHeight}"
    @touchstart='touchstart'
    @touchmove='touchmove'
    @touchend='touchend'
    @scroll="scroll"
    @scrolltolower = 'scrolltolower'
  >
  <div class="freshIconWrap" v-if='fresh'   @animationend='animationend' :animation='animationData'  :class="animateClass" >
    <img src="/static/images/rotate.png" mode='widthFix' class="freshIcon" alt="">
  </div>
  <slot></slot>
  <load-more ref='loadmore' v-if='loadMore'  :listLen='listLen'  :totalPages='totalPages' :pageNum='pageNum' @load='$emit("load")'></load-more>
  <template v-if='showInvalidPic'>
    <div v-if='listLen === 0 && !loading'  class="invalidImgWrap" :style="{'height':scrollViewHeight}">
      <img src="/static/images/no-schedule.png" alt=""  mode='widthFix'>
      <span>亲，还没有内容哦～</span>
    </div>
    <div v-if='loading' class="invalidImgWrap" :style="{'height':scrollViewHeight}"  @touchmove.prevent.stop>
      <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
    </div>
  </template>
  <div  @touchmove.prevent.stop class="cover"  v-if='isFreshing'></div>
</scroll-view>
</template>
<script>
// import { EventBus } from './eventbus'
import loadMore from '@/components/load-more'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      intoViewId: '',
      startPos: -60,
      animationData: {},
      isFreshing: false,
      animateClass: '',
      loadMore: false,
      fresh: false,
      IOS: true
    }
  },
  components: {
    loadMore
  },
  computed: {
    ...mapState(['loading', 'loadMoreLoading'])
  },
  props: {
    scrollViewHeight: {
      type: String,
      default: '100vh'
    },
    listLen: {
      type: Number,
      default: 1
    },
    totalPages: Number,
    pageNum: Number,
    showInvalidPic: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    loadMoreLoading (n, o) {
      if (this.isFreshing) {
        if (!n) {
          this.isFreshing = false
          this.animateClass = 'rotatetoscale'
          wx.showToast({
            title: '数据更新成功',
            icon: 'none',
            duration: 1000
          })
        }
      }
    }
  },
  methods: {
    animationend (e) {
      if (e.target.animationName.indexOf('routate') !== -1) {
        this.store.commit('loadMoreLoading', false)
        wx.showToast({
          title: '数据更新失败',
          icon: 'none',
          duration: 3000
        })
      }
      this.animation.translate('-50%', `${this.startPos}px`).opacity(0).step({duration: 0})
      this.animationData = this.animation.export()
      setTimeout(() => {
        this.animateClass = ''
      }, 300)
    },
    touchstart (e) {
      if (this.loadMoreLoading || !this.fresh || this.scrolltop > 100) return
      this.start = e.clientY
      this.startX = e.clientX
      this.onOff = false
    },
    touchmove (e) {
      if (this.onOff) return
      if (this.loadMoreLoading || !this.fresh || this.scrolltop > 100) return
      this.moveDis = e.clientY - this.start
      this.moveDisX = e.clientX - this.startX
      if (Math.abs(this.moveDisX) > Math.abs(this.moveDis)) this.onOff = true
      if (this.moveDis > 300) this.moveDis = 300
      this.animation.translate('-50%', `${((this.moveDis / 2 + this.startPos))}px`).opacity(1).step({duration: 0})
      this.animationData = this.animation.export()
    },
    touchend (e) {
      if (this.onOff) return
      if (this.loadMoreLoading || !this.fresh || !this.moveDis || this.scrolltop > 100) return
      this.startPos = -60
      if (this.moveDis < 200) {
        this.animation.translate('-50%', `${this.startPos}px`).step({duration: 200})
        this.animationData = this.animation.export()
      } else {
        this.isFreshing = true
        this.animation.translate('-50%', `0px`).step({duration: 200})
        this.animationData = this.animation.export()
        setTimeout(() => {
          this.$emit('fresh')
          this.animateClass = 'animate'
        }, 290)
        this.moveDis = 0
      }
    },
    scroll (v) {
      this.deltaY = v.target.deltaY
      this.scrolltop = v.target.scrollTop
      this.$emit('scroll', v)
    },
    scrolltolower (v) {
      if (!this.loadMore) return
      if (this.deltaY < 0 && this.listLen !== 0) {
        console.log('onReachBottom')
        this.$refs.loadmore.onReachBottom()
      }
    },
    scrollTo (v) {
      this.intoViewId = v
      setTimeout(() => {
        this.intoViewId = null
      }, 1000)
    }
  },
  onLoad () {
    let _this = this
    if (/ios/ig.test(this.$store.state.system)) {
      _this.IOS = true
    } else {
      _this.IOS = false
    }
    this.deltaY = 0
    this.isFreshing = false
    this.animation = wx.createAnimation({
      timingFunction: 'linear'
    })
    this.animation.translate('-50%', `${this.startPos}px`).opacity(0).step({duration: 0})
    this.animationData = this.animation.export()

    this.listeners = this.$listeners
    if (!this.listeners) return
    if (typeof this.listeners.load === 'function') {
      this.loadMore = true
    }
    if (typeof this.listeners.fresh === 'function') {
      this.fresh = true
    }
  }
}
</script>
<style lang="less" scoped>
.mtScrollview{
  position: relative;
  .cover{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 10000;
    // background: rgba(0,0,0,0.5)
  }
}
.freshIconWrap{
  margin: 20px;
  width: 40px;
  height: 40px;
  position: absolute;
  padding: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0px 0px 8px  #ccc;
  left: 50%;
  transform: translate(-50%, -60px);
  z-index: 2000;
}
.freshIcon{
  width: 100%;
  height: 100%;
}
.animate {
  animation-name: routate; /*动画的名称 */
  animation-duration: 10000ms; /*动画从开始到结束的时间*/
  animation-timing-function: linear; /*动画执行快慢的参数*/
  animation-iteration-count: alternate; /*动画执行多少次的参数*//*以下是兼容ios所需，参数意义与上相同*/
}
.rotatetoscale {
  animation-name: scale; /*动画的名称 */
  animation-duration: 300ms; /*动画从开始到结束的时间*/
  animation-timing-function: linear; /*动画执行快慢的参数*/
  animation-iteration-count: alternate; /*动画执行多少次的参数*//*以下是兼容ios所需，参数意义与上相同*/
  animation-fill-mode: forwards;
}
@keyframes routate {
  /*开始转的角度*/
  from {
    transform: translate(-50%, 0px) rotate(0deg);
  }/*结束的角度*/
  to {
    transform: translate(-50%, 0px) rotate(2500deg);
  }
}
@keyframes scale {
  /*开始转的角度*/
  from {
    transform: translate(-50%, 0px) rotate(0deg) scale(1);
    opacity: 1;
  }/*结束的角度*/
  to {
    transform: translate(-50%, 0px) rotate(200deg) scale(0);
    opacity: 0;
  }
}
.invalidImgWrap{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  background: #fff;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 1000;
  img{
    width: 35%;
    margin-top: -20px;
    margin-bottom: 20px;
  }
  span{
    font-size: 20px;
    color: #8b8fa0;
  }
}
</style>
