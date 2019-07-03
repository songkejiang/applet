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
      <div class="live-list-item" v-for="(item, index) in normalizeData" :key='index' @click="jumpPage(`/pages/live-detail/main?videoId=${item.id}`)">
        <div class="live-img">
          <img :src="item.coverPhoto" alt="">
        </div>
        <div class="live-info">
          <p>{{item.title}}</p>
          <div class="info-extra">
            <span class="type">{{item.price ? item.price : '免费'}}</span>
            <span>{{item.createdAt}}</span>
          </div>
        </div>
      </div>
      <div class="load-more" v-show="showLoadMore">{{loadText}}</div>
    </mt-scroll-view>
</template>
<script>
  import mtScrollView from '@/components/mt-scroll-view'
  import {mapActions, mapState} from 'vuex'
  import jumpPage from '@/mixins/jumpPage'
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
    props: {
      scrollHeight: {
        default: 0,
        type: Number
      }
    },
    computed: {
      ...mapState({
        liveList: 'collectLiveList'
      }),
      normalizeData () {
        this.cache = this.cache || []
        if (!this.load) {
          this.cache = this.liveList.slice()
        } else {
          this.cache.push(...this.liveList)
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
        this.$store.commit('loading', true)
        pageNum = pageNum || 1
        this.setLiveList({
          pageNum: pageNum,
          pageSize: this.pageSize
        }).then(res => {
          this.totalPages = res.totalPages
        })
      },
      ...mapActions([
        'setLiveList'
      ])
    }
  }
</script>
<style lang="less">
    .live-list-item{
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .live-info{
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
            color: #409EFF;
            font-size: 28rpx;
          }
        }
      }
      .live-img{
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
</style>
