<template>
    <scroll-view scroll-y style="height:100%" @scrolltolower="scrolltolower">
      <div v-for="program in normalizeData"
           :key="program.id" class="program"
           @click="jumpPage(`/pages/video-detail/main?videoId=${program.videoId}`)">
        <img :src="program.coverPhoto" alt="" class="pic">
        <div class="des">
          <p class="title">{{program.title}}</p>
          <p class="name">
            <span class="play-icon"><img src="http://store-pic.medmeeting.com/FrnBiTJbXcvOdcMMZ1MTdLslF_yV" alt="">{{program.playCount}}</span>
            <span class="time">{{program.createTime}}</span>
          </p>
        </div>
      </div>
      <!--<p class="download-link" @click="downLoadApp">更多回放视频请下载医会宝观看</p>-->
    </scroll-view>
</template>
<script>
  import { mapActions } from 'vuex'
  // import jumpPage from '@/mixins/jumpPage'
  export default {
    // mixins: [jumpPage],
    data () {
      return {
        showLoadMore: false,
        pageNum: 1,
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
      normalizeData () {
        this.cache = this.cache || []
        let videoRelatedList = this.$store.state.videoRelatedList
        if (videoRelatedList.length) {
          if (!this.isPullUpLoad) {
            this.cache = videoRelatedList.slice()
          } else {
            this.cache.push(...videoRelatedList)
          }
          this.cache = this.cache.map(item => {
            item.createTime = this.$formateDate('yyyy-MM-dd hh:mm', item.createTime)
            return item
          })
        }
        return this.cache
      }
    },
    methods: {
      jumpPage (v) {
        wx.redirectTo({
          url: v
        })
      },
      scrolltolower () {
        this.isPullUpLoad = true
        if (this.pageNum >= this.totalPages) {
          return
        } else {
          ++this.pageNum
        }
        this.setVideoRelated({
          pageNum: this.pageNum,
          pageSize: 8,
          roomId: this.roomId
        }).then((res) => {
          this.totalPages = res.totalPages
        })
      },
      downLoadApp () {
        // window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.medmeeting.m.zhiyi'
      },
      ...mapActions([
        'setVideoRelated'
      ]),
      getData (v) {
        if (!v.roomId) return
        this.roomId = v.roomId
        this.setVideoRelated({
          pageNum: this.pageNum,
          pageSize: 8,
          roomId: v.roomId
        }).then(res => {
          this.totalPages = res.totalPages
        })
      }
    },
    onLoad () {
      // 清除state
      this.pageNum = 1
      this.isPullUpLoad = false
      this.cache = []
    }
  }
</script>
<style lang="less">
  .program {
    display: flex;
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
    width: 100%;
    box-sizing: border-box;
    &:active {
      background-color: #ececec;
    }
    .pic {
      width: 220px;
      height: 140px;
      flex: none;
    }
    .des {
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      position: relative;
      color: #666;
      overflow: hidden;
      .title {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        font-size: 28px;
      }
      .name {
        position: absolute;
        right: 20px;
        left: 20px;
        bottom: 0;
        font-size: 26px;
        overflow: hidden;
        .play-icon{
          img{
            width: 26px;
            height: 22px;
            margin-right: 10px;
          }
        }
        .time{
          float: right;
        }
      }
      .label-wrap {
        float: right;
      }
      .label {
        font-size: 24px;
        float: right;
        border: 2px solid #3094fa;
        color: #3094fa;
        line-height: 24px;
        border-radius: 8px;
        padding: 0 8px;
        margin-top: 8px;
        &.type {
          margin-left: 16px;
          color: #ef4f4f;
          border: 2px solid #ef4f4f;
        }
      }
    }
  }

  .download-link {
    line-height: 100px;
    text-align: center;
    &:active {
      background-color: #ececec;
    }
  }
</style>
