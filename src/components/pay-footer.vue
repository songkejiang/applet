<template>
  <div class="payFooter">
    <div class="main">
      <div class="paytotal">
        应付金额：
        <span class="money">¥ {{price}}</span>
      </div>
      <div class="btn" @click='handlePayBtn'>立即购买</div>
    </div>
    <div class="pop"
       v-show="showPop"
       @click="close">
      <div class="detail"
       :animation='animationData'
       @click.stop >
        <div class="title">付款内容</div>
        <ul class="list">
          <li>
            <span>内容付费</span>
            <span class="color1">{{price}}</span>
          </li>
          <li>
            <span>使用红包</span>
            <span class="color1" v-if='couponsList.length' @click="jumpPage">{{couponsList && couponsList.length}}个可用 ></span>
            <span class="color1" v-else >暂无可用红包 ></span>
          </li>
          <li>
            <span>实际支付</span>
            <span class="color1">{{payPrice}}</span>
          </li>
        </ul>
        <div class="paybtn" @click='getOpenId'>
          立即购买
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Payment from './Payment'
import { mapActions, mapState } from 'vuex'
import { throttle } from '@/utils'
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    type: String
  },
  data () {
    return {
      showPop: false,
      animationData: {},
      payPrice: null
    }
  },
  computed: {
    ...mapState({
      couponsList: 'couponsList'
    }),
    price () {
      if (this.info.isDiscount && this.info.discountEndTime > Date.now()) {
         return this.info.discountPrice
      }
      return this.info.price
    },
    couponUserId () {
      return this.$store.state.couponUserId || ''
    }
  },
  watch: {
    '$store.state.couponId' (v) {
      if (v) {
        this.getPayAmount()
      }
    }
  },
  methods: {
    ...mapActions([
      'setCouponsList',
      'setCouponId'
    ]),
    getPayAmount () {
      let serverId = null
      let videoType = null
      if (this.type === 'live') {
        serverId = this.info.id
        videoType = 'LIVE_TICKE'
      }
      if (this.type === 'video') {
        serverId = this.info.videoId
        videoType = 'VIDEO_TICKE'
      }
      if (this.type === 'series') {
        serverId = this.info.seriesId
        videoType = 'VIDEO_SERIES'
      }
      this.setCouponsList({
        serviceId: serverId,
        serviceType: this.type.toUpperCase() // 类型：VIDEO /LIVE /SERIES （视频/直播/系列课程）
      })
      if (serverId && videoType) {
        this.setCouponId({
          serverId,
          couponUserId: this.couponUserId,
          videoType
        }).then((res) => {
          console.log(res)
          this.payPrice = res.amount
        })
      }
    },
    jumpPage () {
      let id = null
      switch (this.type) {
        case 'live':
        id = this.info.id
        break
        case 'video':
        id = this.info.videoId
        break
        case 'series':
        id = this.info.seriesId
        break
      }
      wx.navigateTo({
        url: `/pages/packet/main?type=${this.type}&id=${id}`
      })
    },
    close () {
      this.animation.translate(0, '100%').step({duration: 200})
      this.animationData = this.animation.export()
      setTimeout(() => {
        this.showPop = false
      }, 200)
    },
    handlePayBtn () {
      if (!this.$store.state.token) {
        return wx.navigateTo({
          url: '/pages/login/main?from=login'
        })
      }
      this.showPop = true
      this.$store.commit({
        type: 'SET_COUPON_ID',
        couponId: ''
      })
      this.getPayAmount()
      setTimeout(() => {
        this.animation.translate(0, 0).step({duration: 200})
        this.animationData = this.animation.export()
      }, 100)
    },
    getOpenId: throttle(3000, true, function () {
      /*eslint-disable */
      let that = this
      let payId = null
      if (this.type === 'live') {
        payId = this.info.id
      }
      if (this.type === 'video') {
        payId = this.info.videoId
      }
      if (this.type === 'series') {
        payId = this.info.seriesId
      }
      let payment = new Payment(this.type, payId)
      payment.pay().then((res) => {
        console.log('支付成功')
        that.$emit('success')
        that.close()
      }, (e) => {
        that.$emit('failed')
      })
    })
  },
  onUnload () {
    this.animation.translate(0, '100%').step({duration: 0})
    this.animationData = this.animation.export()
    this.showPop = false
  },
  created () {
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
  }
}
</script>
<style lang="less" scoped>
  .payFooter{
    position: fixed;
    width: 100%;
    z-index: 1000;
    bottom: 0;
    .main{
      background: #fff;
      display: flex;
      line-height: 100px;
      justify-content: space-between;
      align-items: center;
      height: 100px;
      .paytotal{
        font-size: 26px;
        margin-left: 50px;
        .money{
          font-size: 50px;
          color: #0078ff;
          font-weight: 700;
        }
      }
      .btn{
        margin-right: 50px;
        background: linear-gradient(90deg, #0ca1fe, #4961fe);
        color: #fff;
        height: 70px;
        border-radius: 10px;
        font-size: 24px;
        line-height: 70px;
        padding: 0px 40px;
        box-sizing: border-box;
        box-shadow: 0px 0px 16px #0f9efe;
      }
    }
    .pop{
      position: absolute;
      width: 100%;
      height: 100vh;
      bottom: 0;
      background: rgba(0, 0, 0, .5);
      .detail{
        position: absolute;
        width: 100%;
        bottom: 0;
        background: #fff;
        padding: 0 20px;
        transform: translateY(100%);
        box-sizing: border-box;
        .title{
          text-align: center;
          font-size: 30px;
          padding: 20px 0;
        }
        .paybtn{
          width: 70%;
          background: linear-gradient(90deg, #0ca1fe, #4961fe);
          color: #fff;
          font-size: 24px;
          text-align: center;
          height: 70px;
          line-height: 70px;
          border-radius: 35px;
          margin: 50px auto;
        }
        .list{
          li {
            border-bottom: 1px solid #f4f4f4;
            font-size: 24px;
            color: #a6a8b6;
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            .color1{
              color: #a1a3b1;
            }
          }
        }
      }
    }
  }
</style>
