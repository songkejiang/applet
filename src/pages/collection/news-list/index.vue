<template>
  <div class="tab-content-wrapper">
    <scroll-view :style="{height: scrollHeight + 'px'}" scroll-y @scrolltolower="scrolltolower">
      <div class="news-list-item" @click="toWv(`/new/article/share/${item.id}`)" v-for="item in normalizeData">
        <div class="news-info">
          <p>{{item.title}}</p>
          <div class="info-extra">
            <span class="type">{{item.newsTypeName || ''}}</span>
            <span>{{item.createdAt}}</span>
          </div>
        </div>
        <div class="news-img">
          <img :src="item.shareImage" alt="">
        </div>
      </div>
      <div class="load-more" v-show="showLoadMore">{{loadText}}</div>
    </scroll-view>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import * as types from '@/store/mutation-types.js'

  // import formateDate from '@/utils/formateDate.js'
  export default {
    data () {
      return {
        pageNum: 1,
        pageSize: 10,
        normalizeData: [],
        totalPages: 0,
        showLoadMore: false,
        isPullUpLoad: false,
        loadText: '正在加载...',
        type: types.SET_COLLECT_NEWS_LIST,
        baseUrl: `https://mobile.medmeeting.com/#`
      }
    },
    props: {
      scrollHeight: {
        default: 0,
        type: Number
      }
    },
    created () {
      this.clearState(this.type)
      this.setNewsList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.totalPages = res.totalPages
      })
    },
    computed: {
      ...mapState({
        newsList: 'collectNewsList'
      })
    },
    methods: {
      toWv (url) {
        console.log(123)
        wx.navigateTo({
          url: `/pages/web-view/main?url=${this.baseUrl}${url}`
        })
      },
      clearState (type) {
        this.$store.commit(type, {
          list: []
        })
      },
      scrolltolower () {
        if (!this.isPullUpLoad) {
          console.log(this.pageNum, this.totalPages)
          this.showLoadMore = true
          this.isPullUpLoad = true
          if (this.pageNum >= this.totalPages) {
            this.loadText = '已经到底啦'
            return
          } else {
            ++this.pageNum
            this.isPullUpLoad = true
          }
          this.setNewsList({
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }).then(() => {
            // this.showLoadMore = false
            this.isPullUpLoad = false
          })
        }
      },
      loadData () {
        this.showLoadMore = true
        ++this.pageNum
        if (this.pageNum > this.totalPages) {
          this.loadText = '已经到底啦'
          return
        }
        this.setNewsList({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(() => {
          this.showLoadMore = false
        })
      },
      dateFormat (time) {
        return time
        // return formateDate('MM月dd号', time)
      },
      ...mapActions([
        'setNewsList'
      ])
    },
    watch: {
      newsList (newVal) {
        this.normalizeData = newVal.map(item => {
          item.createdAt = this.$formateDate('MM月dd号', item.createdAt)
          return item
        })
        console.log(this.normalizeData)
      }
    }
  }
</script>
<style lang="less">
  .tab-content-wrapper{
    height: 100%;
    padding: 0 20rpx;
    .news-list-item{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .news-info{
        position: relative;
        flex: 1;
        margin-right: 20rpx;
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
          }
        }
      }
      .news-img{
        width: 260rpx;
        height: 160rpx;
        img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
    }
    .load-more{
      font-size: 24rpx;
      text-align: center;
      margin: 20rpx 0;
    }
  }
</style>
