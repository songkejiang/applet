<template>
  <mt-scroll-view
   scrollViewHeight='100%'
   :listLen='len'
   @fresh='fresh'
  >
      <div class="pay-list" v-if="payLiveList.length">
        <p class="title">
          已购直播
          <span v-if="payLiveList.length >= 3" @click="more('live')">更多></span>
        </p>
        <div class="item" v-for="(item, index) in payLiveList" :key="index" @click="jumpPage(`/pages/live-detail/main?videoId=${item.id}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <div>
                <img  class="icon "  src="/static/images/star.png"/>
                <span class="collect">{{item.collectCount}}</span>
              </div>
              <span class="time">{{item.startTime2}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--视频-->
      <div class="pay-list" v-if="payVideoList.length">
        <p class="title">
          视频订单
          <span v-if="payVideoList.length >= 3" @click="more('video')">更多></span>
        </p>
        <div class="item" v-for="(item, index) in payVideoList" :key="index" @click="jumpPage(`/pages/video-detail/main?videoId=${item.videoId}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <div>
                <img  class="icon "  src="/static/images/star.png"/>
                <span class="collect">{{item.collectCount}}</span>
              </div>
              <span class="time">{{item.createTime2}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--系列课程-->
      <div class="pay-list" v-if="paySeriesList.length">
        <p class="title">
          课程订单
          <span v-if="paySeriesList.length >= 3" @click="more('series')">更多></span>
        </p>
        <div class="item" v-for="(item, index) in paySeriesList" :key="index" @click="jumpPage(`/pages/series-detail/main?seriesId=${item.seriesId}`)">
          <div class="item-img">
            <img :src="item.coverPhoto" alt="">
          </div>
          <div class="item-info">
            <p>{{item.title}}</p>
            <div class="info-extra">
              <div>
                <img  class="icon "  src="/static/images/star.png"/>
                <span class="collect">{{item.collectCount}}</span>
              </div>
              <span class="time">{{item.createTime2}}</span>
            </div>
          </div>
        </div>
      </div>
  </mt-scroll-view>
</template>
<script>
  import {mapActions} from 'vuex'
  import * as types from '@/store/mutation-types.js'
  import jumpPage from '@/mixins/jumpPage'
  import mtScrollView from '@/components/mt-scroll-view'
  export default {
    mixins: [jumpPage],
    components: {
      mtScrollView
    },
    data () {
      return {
        liveType: types.SET_PAY_LIVE_LIST,
        videoType: types.SET_PAY_LIVE_LIST,
        seriesType: types.SET_PAY_SERIES_LIST,
        pageSize: 3,
        pageNum: 1
      }
    },
    methods: {
      fresh () {
        this.getData()
      },
      getData () {
        this.setIsPayLiveList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'SUCCESS'
        })
        this.setIsPayVideoList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'SUCCESS'
        })
        this.setIsPaySeriesList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: 'SUCCESS'
        })
      },
      more (type) {
        wx.navigateTo({
          url: `/pages/order/all-order/main?type=${type}&tradeStatus=SUCCESS`
        })
      },
      ...mapActions([
        'setIsPayLiveList',
        'setIsPayVideoList',
        'setIsPaySeriesList'
      ])
    },
    computed: {
      payLiveList () {
        let payLiveList = this.$store.state.payLiveList.slice()
        if (payLiveList) {
          return payLiveList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            item.startTime2 = this.$formateDate('yyyy-MM-dd hh:mm', item.startTime)
            return item
          })
        }
        return []
      },
      payVideoList () {
        let payVideoList = this.$store.state.payVideoList.slice()
        if (payVideoList) {
          return payVideoList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            item.createTime2 = this.$formateDate('yyyy-MM-dd hh:mm', item.createTime)
            return item
          })
        }
        return []
      },
      paySeriesList () {
        let paySeriesList = this.$store.state.paySeriesList.slice()
        if (paySeriesList) {
          return paySeriesList.map((item) => {
            item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
            item.createTime2 = this.$formateDate('yyyy-MM-dd hh:mm', item.createTime)
            return item
          })
        }
        return []
      },
      len () {
        return this.payLiveList.length + this.payVideoList.length + this.paySeriesList.length
      }
    }
  }
</script>
<style lang="less" scoped>
  .noComment{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    img{
      width: 50%;
    }
  }
    .pay-list{
      margin-bottom: 20rpx;
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
            font-size: 32rpx;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          .info-extra{
            position: absolute;
            width: 100%;
            bottom: 0;
            text-align: right;
            font-size: 24rpx;
            display: flex;
            justify-content: space-between;
            span{
              font-size: 24rpx;
              color: #838899;
            }
            .icon {
              width: 25px;
              height: 25px;
              margin-right: 10px;
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
