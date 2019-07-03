<template>
    <mt-scroll-view
      scrollViewHeight="100%"
      :listLen='normalizeData.length'
      :totalPages= 'totalPages'
      :pageNum= 'pageNum'
      @load='loadMore'
      @fresh='fresh'
      ref='scrollView'
    >
      <div @click="jumpPage(`/pages/video-detail/main?videoId=${item.videoId}`)" class="video-list-item" v-for="(item, index) in normalizeData" :key='index'>
        <div class="video-img">
          <img :src="item.coverPhoto" alt="">
        </div>
        <div class="video-info">
          <p>{{item.title}}</p>
          <div class="info-extra">
            <span class="type"><img src="http://store-pic.medmeeting.com/FrnBiTJbXcvOdcMMZ1MTdLslF_yV" alt="">{{item.playCount}}</span>
            <span>{{item.createdAt}}</span>
          </div>
        </div>
      </div>
      <div class="load-more" v-show="showLoadMore">{{loadText}}</div>
    </mt-scroll-view>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import jumpPage from '@/mixins/jumpPage'
  import mtScrollView from '@/components/mt-scroll-view'
  export default {
    mixins: [jumpPage],
    components: {
      mtScrollView
    },
    data () {
      return {
        pageNum: 1,
        pageSize: 10,
        totalPages: 0
      }
    },
    computed: {
      ...mapState({
        videoList: 'collectVideoList'
      }),
      normalizeData () {
        this.cache = this.cache || []
        if (!this.load) {
          this.cache = this.videoList.slice()
        } else {
          this.cache.push(...this.videoList)
        }
        return this.cache && this.cache.map(item => {
          item.createdAt = this.$formateDate('yyyy-MM-dd hh:mm', item.createdAt)
          return item
        })
      }
    },
    methods: {
      fresh () {
        this.cache = []
        this.load = false
        this.getData()
      },
      loadMore () {
        this.load = true
        this.getData(++this.pageNum)
      },
      getData (pageNum) {
        pageNum = pageNum || 1
        if (!this.load) {
          this.$store.commit('loading', true)
        }
        this.setVideoList({
          pageNum: pageNum,
          pageSize: this.pageSize
        }).then(res => {
          this.totalPages = res.totalPages
        })
      },
      ...mapActions([
        'setVideoList'
      ])
    },
    onLoad () {
      // this.getData()
      this.load = false
    }
  }
</script>
<style lang="less">
    .video-list-item{
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .video-info{
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
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          .type{
            font-size: 24rpx;
            display:flex;
            align-items:center;
            img{
              width: 26px;
              height: 22px;
              vertical-align: middle;
              margin-right: 10px;
            }
          }
        }
      }
      .video-img{
        width: 260rpx;
        height: 160rpx;
        margin-right: 20rpx;
        border-radius: 10rpx;
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .load-more{
      font-size: 24rpx;
      text-align: center;
      margin: 20rpx 0;
    }
</style>
