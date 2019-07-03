<template>
  <mt-scroll-view
   scrollViewHeight='100%'
   :listLen='len'
   @fresh='fresh'
  >
      <div class="unpay-list" v-if="unpayLiveList.length">
        <p class="title">直播订单
          <span v-if="unpayLiveList.length >= 3" @click="more('live')">更多></span>
        </p>
        <div class="item" v-for="(item, index) in unpayLiveList" :key="index" @click="jumpPage(`/pages/live-detail/main?videoId=${item.id}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <span class="cancel" @click.stop="cancel('live', item.orderId)">取消订单</span>
              <span class="pay" @click.stop="goPay('live', item.id)">去支付</span>
            </div>
          </div>
        </div>
      </div>
      <!--视频-->
      <div class="unpay-list" v-if="unpayVideoList.length">
        <p class="title">视频订单
          <span v-if="unpayVideoList.length >= 3" @click="more('video')">更多></span>
        </p>
        <div class="item" v-for="(item, index) in unpayVideoList" :key="index" @click="jumpPage(`/pages/video-detail/main?videoId=${item.videoId}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <span class="cancel" @click.stop="cancel('video', item.videoId)">取消订单</span>
              <span class="pay" @click.stop="goPay('video', item.videoId)">去支付</span>
            </div>
          </div>
        </div>
      </div>
      <!--系列课程-->
      <div class="unpay-list" v-if="unpaySeriesList.length">
        <p class="title">课程订单</p>
        <div class="item" v-for="(item, index) in unpaySeriesList" :key="index" @click="jumpPage(`/pages/series-detail/main?seriesId=${item.seriesId}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <span class="cancel" @click.stop="cancel('series', item.serverId)">取消订单</span>
              <span class="pay" @click.stop="goPay('series', item.serverId)">去支付</span>
            </div>
          </div>
        </div>
      </div>
   </mt-scroll-view>
</template>
<script>
  import {mapActions} from 'vuex'
  import * as types from '@/store/mutation-types.js'
  import Payment from '@/components/Payment'
  import mtScrollView from '@/components/mt-scroll-view'
  import jumpPage from '@/mixins/jumpPage'
  export default {
    mixins: [jumpPage],
    components: {
      mtScrollView
    },
    data () {
      return {
        liveType: types.SET_UNPAY_LIVE_LIST,
        videoType: types.SET_UNPAY_LIVE_LIST,
        seriesType: types.SET_UNPAY_SERIES_LIST,
        pageSize: 3,
        pageNum: 1,
        type: ''
      }
    },
    methods: {
      fresh () {
        this.getData()
      },
      getData () {
        this.$store.commit('loading', true)
        this.setIsPayLiveList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'WAIT_PAY'
        })
        this.setIsPayVideoList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'WAIT_PAY'
        })
        this.setIsPaySeriesList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'WAIT_PAY'
        })
      },
      more (type) {
        wx.navigateTo({
          url: `/pages/order/all-order/main?type=${type}&tradeStatus=WAIT_PAY`
        })
      },
      cancel (type, id) {
        this.type = type
        let url = ''
        let params = {}
        if (type === 'live') {
          url = '/liveProgram/user/cancelLiveOrder'
          params.orderId = id
        } else if (type === 'video') {
          url = '/liveVideoPay/order/B/cancelOrder'
          params.serverId = id
          params.videoType = 'VIDEO_TICKE'
        } else {
          url = '/liveVideoPay/order/B/cancelOrder'
          params.serverId = id
          params.videoType = 'VIDEO_SERIES'
        }
        this.cancelOrder(url, params)
      },
      cancelOrder (url, params) {
        this.$http.get(url, params).then(() => {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          })
          if (this.type === 'live') {
            this.setIsPayLiveList({
              pageSize: this.pageSize,
              pageNum: this.pageNum,
              tradeStatus: 'WAIT_PAY'
            })
          } else if (this.type === 'video') {
            this.setIsPayVideoList({
              pageSize: this.pageSize,
              pageNum: this.pageNum,
              tradeStatus: 'WAIT_PAY'
            })
          } else {
            this.setIsPaySeriesList({
              pageSize: this.pageSize,
              pageNum: this.pageNum,
              tradeStatus: 'WAIT_PAY'
            })
          }
        }).catch((err) => {
          wx.showToast({
            title: err.msg,
            icon: 'success',
            duration: 2000
          })
        })
      },
      ...mapActions([
        'setIsPayLiveList',
        'setIsPayVideoList',
        'setIsPaySeriesList'
      ]),
      goPay (type, id) {
        let payment = new Payment(type, id)
        payment.pay().then((res) => {
          this.$emit('success')
        }, (e) => {
          this.$emit('failed')
        })
      }
    },
    computed: {
       unpayLiveList () {
        let unpayLiveList = this.$store.state.unpayLiveList.slice()
        if (unpayLiveList) {
          return unpayLiveList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            return item
          })
        }
        return []
      },
      unpayVideoList () {
        let unpayVideoList = this.$store.state.unpayVideoList.slice()
        if (unpayVideoList) {
          return unpayVideoList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            return item
          })
        }
        return []
      },
      unpaySeriesList () {
        let unpaySeriesList = this.$store.state.unpaySeriesList.slice()
        if (unpaySeriesList) {
          return unpaySeriesList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            return item
          })
        }
        return []
      },
      len () {
        return this.unpayLiveList.length + this.unpayVideoList.length + this.unpaySeriesList.length
      }
    }
  }
</script>
<style lang="less">
  .noComment{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    img{
      width: 50%;
    }
  }
    .unpay-list{
      .title{
        font-size: 28rpx;
        padding: 16rpx 20rpx;
        // border-bottom: 1px solid #eee;
        color: #8b8fa0;
        margin-top: 10px;
        span{
          float: right;
        }
      }
      .item{
        padding: 20rpx;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        .item-info{
          position: relative;
          flex: 1;
          p{
            font-size: 30rpx;
            text-overflow: ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .info-extra{
            position: absolute;
            width: 100%;
            bottom: 0;
            text-align: right;
            font-size: 22px;
            line-height: 1em;
            span{
              padding: 3rpx 12rpx;
              border: 1px solid #8b8fa0;
              border-radius: 50rpx;
            }
            .cancel{
              color:#8b8fa0;
              margin-right: 20rpx;
            }
            .pay{
              color: #fff;
              line-height: 1em;
              background: #3094fa;
              border-color: #3094fa;
            }
          }
        }
        .item-img{
          width: 260rpx;
          height: 160rpx;
          margin-right: 20rpx;
          border-radius: 10rpx;
          img{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
      }
    }
</style>
