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
    <div class="series-list-item" v-for="(item, index) in normalizeData" :key='index' @click="jumpPage(`/pages/series-detail/main?seriesId=${item.seriesId}`)" >
        <div class="series-img">
          <img :src="item.coverPhoto" alt="">
        </div>
        <div class="series-info">
          <p>{{item.title}}</p>
          <div class="info-extra">
            <span class="type">主讲：{{item.authorName}}</span>
            <span>{{item.createdAt}}</span>
          </div>
        </div>

      </div>
      <div class="load-more" v-show="showLoadMore">{{loadText}}</div>
    </mt-scroll-view>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import mtScrollView from '@/components/mt-scroll-view'
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
    computed: {
      ...mapState({
        seriesList: 'collectSeriesList'
      }),
      normalizeData () {
        this.cache = this.cache || []
        if (!this.load) {
          this.cache = this.seriesList.slice()
        } else {
          this.cache.push(...this.seriesList)
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
        this.setSeriesList({
          pageNum: pageNum,
          pageSize: this.pageSize
        }).then(res => {
          this.totalPages = res.totalPages
        })
      },
      ...mapActions([
        'setSeriesList'
      ])
    }
  }
</script>
<style lang="less">
    .series-list-item{
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .series-info{
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
          }
        }
      }
      .series-img{
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
