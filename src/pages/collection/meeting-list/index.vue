<template>
  <div class="tab-content-wrapper">
    <scroll-view :style="{height: scrollHeight + 'px'}" scroll-y @scrolltolower="scrolltolower">
      <div class="meeting-list-item" v-for="item in normalizeData">
        <div class="meeting-img">
          <img :src="item.banner" alt="">
        </div>
        <div class="meeting-info">
          <p>{{item.title}}</p>
          <div class="info-extra">
            <span class="type">主讲：{{item.authorName}}</span>
            <span>{{item.createdAt}}</span>
          </div>
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
        type: types.SET_COLLECT_MEETING_LIST
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
      this.setMeetingList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.totalPages = res.totalPages
      })
    },
    computed: {
      ...mapState({
        meetingList: 'collectMeetingList'
      })
    },
    methods: {
      clearState (type) {
        this.$store.commit(type, {
          list: []
        })
      },
      loadData () {
        this.showLoadMore = true
        ++this.pageNum
        if (this.pageNum > this.totalPages) {
          this.loadText = '已经到底啦'
          return
        }
        this.setMeetingList({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(() => {
          this.showLoadMore = false
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
          this.setMeetingList({
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }).then(() => {
            // this.showLoadMore = false
            this.isPullUpLoad = false
          })
        }
      },
      dateFormat (time) {
        return time
        // return formateDate('MM月dd号', time)
      },
      ...mapActions([
        'setMeetingList'
      ])
    },
    watch: {
      meetingList (newVal) {
        this.normalizeData = newVal.map(item => {
          item.createdAt = this.$formateDate('yyyy-MM-dd', item.createdAt)
          return item
        })
      }
    }
  }
</script>
<style lang="less">
  .tab-content-wrapper{
    padding: 0 20rpx;
    height: 100%;
    .meeting-list-item{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      .meeting-info{
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
      .meeting-img{
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
