<template>
  <mt-scroll-view
    :listLen = 'orderList.length'
    :totalPages= 'totalPages'
    :pageNum= 'pageNum'
    @load='loadMore'
    @fresh='fresh'
    ref='scrollView'
  >
  <div class="order-list">
    <div class="unpay-list">
      <div class="item" v-for="(item, index) in orderList" :key="index" @click='jump(item)'>
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
            <span class="time">{{item.startTime}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </mt-scroll-view>
</template>
<script>
  import jumpPage from '@/mixins/jumpPage'
  import mtScrollView from '@/components/mt-scroll-view'
  export default {
    components: {
      mtScrollView
    },
    mixins: [jumpPage],
    data () {
      return {
        orderList: [],
        pageSize: 10,
        pageNum: 1,
        type: '',
        totalPages: 0,
        tradeStatus: ''
      }
    },
    onLoad (options) {
      this.type = options.type
      this.tradeStatus = options.tradeStatus
      this.orderList = []
      this.getData(this.type)
    },
    methods: {
      fresh () {
        this.load = false
        this.getData(this.type)
      },
      jump (item) {
        console.log(item)
        if (this.type === 'live') {
          this.jumpPage(`/pages/live-detail/main?videoId=${item.id}`)
        } else if (this.type === 'video') {
          this.jumpPage(`/pages/video-detail/main?videoId=${item.videoId}`)
        } else {
          this.jumpPage(`/pages/series-detail/main?seriesId=${item.seriesId}`)
        }
      },
      loadMore () {
        this.load = true
        this.getData(this.type, ++this.pageNum)
      },
      getData (type, pageNum) {
        pageNum = pageNum || 1
        const params = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          tradeStatus: this.tradeStatus
        }
        this.type = type
        if (!this.load) {
          this.$store.commit('loading', true)
        }
        if (type === 'live') {
          const url = '/liveProgram/user/order'
          return this.getOrderList(url, params)
        } else if (type === 'video') {
          const url = '/video/user/order'
          return this.getOrderList(url, params)
        } else {
          const url = '/liveVideoPay/order/A/orderSeries'
          return this.getOrderList(url, params)
        }
      },
      normalize (data) {
        return data.map(item => {
          item.startTime = this.$formateDate('yyyy-MM-dd hh:mm', item.startTime)
          return item
        })
      },
      getOrderList (url, params) {
        return this.$http.post(url, params).then(res => {
          if (!this.load) {
            this.orderList = [].concat(this.normalize(res.data))
          } else {
            this.orderList = this.orderList.concat(this.normalize(res.data))
          }
          this.totalPages = res.totalPages
          return Promise.resolve()
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="less">
  .unpay-list{
    margin-bottom: 20rpx;
    .title{
      font-size: 28rpx;
      padding: 16rpx 20rpx;
      border-bottom: 1px solid #ccc;
      color: #ccc;
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
  .load-status{
    text-align: center;
    font-size: 24rpx;
    padding: 20rpx auto;
  }
</style>
