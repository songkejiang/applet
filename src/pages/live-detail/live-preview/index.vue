<template>
  <scroll-view scroll-y style="height: 100%" @scrolltolower="scrolltolower">
    <!--VIP-->
    <div class="scroll" v-if="info.programType === 'VIP'">
      <div v-for="program in normalizeData" :key="program.id" class="program" @click="">
        <img :src="program.coverPhoto"  alt="" class="pic">
        <div class="des">
          <p class="title">{{program.title}}</p>
          <p class="name">
            <span>{{program.playCount}}</span>
            <span class="time">{{program.createTime}}</span>
          </p>
        </div>
      </div>
    </div>
    <!--EVENT-->
    <div class="scroll" v-if="info.programType === 'EVENT'">
      <div v-for="program in normalizeData" :key="program.id" class="program" @click="">
        <img :src="program.coverPhoto" alt="" class="pic">
        <div class="des">
          <p class="title">{{program.title}}</p>
          <p class="name">
            <span>{{program.chargeType === 'no' ? '免费' : program.price}}</span>
            <span class="time">{{program.startTime}}</span>
          </p>
        </div>
        <div class="live-status">
          {{program.liveStatus === 'play' ? '直播' : '预告'}}
        </div>
      </div>
    </div>
    <div v-if='!normalizeData.length' class='noComment'>
        <img src="/static/images/no-schedule.png" mode='widthFix' alt="">
        <span>亲，还没有内容哦～</span>
    </div>
  </scroll-view>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    data () {
      return {
        programList: [],
        pageNum: 1,
        totalPages: 0
      }
    },
    props: {
      info: Object,
      scrollHeight: {
        default: 0,
        type: Number
      }
    },
    methods: {
      downLoadApp () {
        window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.medmeeting.m.zhiyi'
      },
      ...mapActions([
        'getLiveRelatedVideo'
      ]),
      scrolltolower () {
        this.isPullUpLoad = true
        if (this.pageNum >= this.totalPages) {
          return
        } else {
          ++this.pageNum
        }
        this.getData(this.info)
      },
      getData (newVal) {
          this.getLiveRelatedVideo({
            roomId: newVal.roomId,
            pageSize: 10,
            pageNum: this.pageNum
          }).then(res => {
            console.log('111111', res)
            this.totalPages = res.totalPages
          })
      }
    },
    computed: {
      ...mapState({
        liveRelatedList: 'liveRelatedList'
      }),
      normalizeData () {
        this.cache = this.cache || []
        const currentData = this.liveRelatedList
        if (!this.isPullUpLoad) {
          this.cache = currentData.slice()
        } else {
          this.cache.push(...currentData)
        }
        console.log('cache', this.cache)
        this.cache = this.cache && this.cache.map(item => {
          item.createTime = this.$formateDate('yyyy-MM-dd hh:mm:ss', item.createTime)
          return item
        })
        return this.cache
      }
    },
    onLoad () {
      this.pageNum = 1
      this.isPullUpLoad = false
      this.totalPages = 0
      this.cache = []
    }
  }
</script>

<style scoped lang="less">
  .scroll {
    /*overflow: scroll;*/
    /*height: 100%;*/
  }
  .program {
    display: flex;
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
    width: 100%;
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
      position: relative;
      color: #666;
      overflow: hidden;
      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: 26px;
        padding-right: 20rpx;
      }
      .name {
        position: absolute;
        right: 20px;
        left: 20px;
        bottom: 0;
        font-size: 26px;
        overflow: hidden;
        .time{
          float: right;
          margin-right: 20rpx;
        }
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
    .live-status{
      flex: 0 0 auto;
      padding-right: 20px;
    }
  }
  .noComment{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    img{
      width: 35%;
      margin-top: -20px;
      margin-bottom: 20px;
    }
    span{
      font-size: 20px;
      color: #8b8fa0;
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
