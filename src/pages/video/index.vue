<template>
    <div>
      <div class="labelTab" id='fixtop'>
        <label-tab  ref='labelTab' firstName='全部' selectIndex='1' @oneLabelChange='oneLabelChange' @secondLabelChange='secondLabelChange' @click='handleTabClick'></label-tab>
      </div>
    <mt-scroll-view
      :scrollViewHeight='scrollViewHeight'
      :listLen = 'videoRecommendList.length*activeIndex+videoPageList.length'
      :totalPages= 'totalPages'
      :pageNum= 'pageNum'
      @load='loadMore'
      @fresh='fresh'
      ref='scrollView'
    >
      <div id='video'>
      <div class="vip-live" v-if='show && videoRecommendList.length'>
        <div class="text">
          <img src="/static/images/recommend_liveHeader.png" class="fire" alt="" mode='widthFix'>
          精选视频
          <span class="lookmore" v-if='videoRecommendList.length>1' @click='jumpPage("/pages/video-recommend-more/main")'>查看更多</span>
        </div>
        <div class="content">
          <div class="collect_item" v-for='(item, index) in videoRecommendList' :key='index'>
            <div class="img_wrap" @click='jumpPage("/pages/video-detail/main?videoId="+item.videoId)'>
              <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
            </div>
            <list-card :item='item' />
          </div>
        </div>
      </div>
      <div class="vip-live" v-if='videoPageList.length'>
        <div class="text">
          <img src="/static/images/video_course_lis.png" alt="" mode='widthFix'>
          视频列表
        </div>
        <div class="content">
          <div class="collect_item" v-for='(item, index) in videoPageList' :key='index'>
              <div class="img_wrap" @click='jumpPage("/pages/video-detail/main?videoId="+item.videoId)'>
                <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
              </div>
              <list-card :item='item' />
          </div>
        </div>
      </div>
      </div>
    </mt-scroll-view>
  </div>
</template>
<script>
import loadMore from '@/components/load-more'
import { mapActions, mapState } from 'vuex'
import labelTab from '@/components/label-tab'
import jumpPage from '@/mixins/jumpPage'
import mtScrollView from '@/components/mt-scroll-view'
import listCard from '@/components/list-card'
export default {
  mixins: [jumpPage],
  components: {
    loadMore,
    labelTab,
    mtScrollView,
    listCard
  },
  props: {
    oneLabelId: {
      default: -1,
      type: Number
    },
    secondLabelId: {
      default: -1,
      type: Number
    },
    currentId: {
      default: -1,
      type: Number
    }
  },
  data () {
    return {
      pageNum: 1,
      totalPages: 0,
      list: [],
      paddingTop: '58rpx',
      playingPrograme: [],
      show: true,
      activeIndex: 0,
      scrollViewHeight: 'calc(100vh - 64rpx)'
    }
  },
  computed: {
    ...mapState(['loading']),
    videoPageList () {
      this.cache = this.cache || []
      if (this.list) {
        if (!this.load) {
          this.cache = this.list.slice()
        } else {
          this.cache.push(...this.list)
        }
        this.cache = this.cache.map((item) => {
          item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
          // item.startTime2 = this.$formateDate('yyyy-MM-dd hh:mm', item.startTime)
          return item
        })
      }
      return this.cache
    },
    videoRecommendList () {
      if (this.$store.state.videoRecommendList) {
        let videoRecommendList = this.$store.state.videoRecommendList.data.slice()
        if (videoRecommendList.length > 4) videoRecommendList.length = 4
        return videoRecommendList
      }
      return []
    }
  },
  methods: {
    fresh () {
      this.cache = []
      this.load = false
      this.getData()
    },
    ...mapActions([
      'getVideoRecmmend'
    ]),
    async oneLabelChange ({item, index}) {
      this.$store.commit('loading', true)
      this.load = false
      this.oneLabelId = item.id
      this.secondLabelId = -1
      if (index !== 0) {
        this.scrollViewHeight = 'calc(100vh - 146rpx)'
      } else {
        this.scrollViewHeight = 'calc(100vh - 64rpx)'
      }
      await this.isShowInvalid()
      this.$refs.scrollView.scrollTo('video')
      if (item.id !== -1) {
        this.show = false
      } else {
        this.show = true
      }
    },
    async secondLabelChange (v) {
      this.$store.commit('loading', true)
      this.load = false
      this.secondLabelId = v.id
      await this.isShowInvalid()
      this.$refs.scrollView.scrollTo('video')
    },
    loadMore () {
      this.load = true
      this.getData(++this.pageNum)
    },
    async getData (pageNum) {
      let params
      if (this.secondLabelId !== -1 && this.secondLabelId) {
        params = {
          pageNum: pageNum || 1,
          pageSize: 12,
          videoType: 'VIP',
          twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
        }
      } else {
        params = {
          pageNum: pageNum || 1,
          pageSize: 12,
          videoType: 'VIP',
          oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null
        }
      }
      await this.$http.post(`/open/video/page`, params, {loading: false})
        .then(res => {
          if (this.oneLabelId === -1) {
            this.activeIndex = 1
          } else {
            this.activeIndex = 0
          }
          this.list = res.data
          this.pageNum = res.pageNum
          this.totalPages = res.totalPages
        })
    },
    async getRecmmend () {
      await this.getVideoRecmmend({
        code: 'V_H_VIDEO',
        pageNum: 1,
        pageSize: 4
      })
    },
    async isShowInvalid (id) {
      if (id === -1) {
        await this.getRecmmend()
      }
      await this.getData()
    }
  },
  onLoad () {
    this.load = false
    this.cache = []
    this.$store.commit('loading', true)
    this.$store.commit({
      type: 'SETVIDEORECOMMENDLIST',
      videoRecommendList: ''
    })
    this.isShowInvalid(-1)
  }
}
</script>
<style scoped lang='less'>
    .vip-live{
      background: #fff;
      padding: 25px 40px 30px;
      font-size: 30px;
      // font-weight: bold;
      .text {
        padding: 20px 15px;
        box-sizing: border-box;
        position: relative;
        .lookmore{
          color: #1c90fe;
          font-size: 25px;
          float: right
        }
        .onliving{
          font-size: 24px;
          font-weight: normal;
          color: #8b8fa0;
        }
        img{
          width: 38px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .fire{
          width: 30px;
        }
      }
      .content{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .collect_item{
        display: flex;
        flex-direction: column;
        width: 48%;
        margin-bottom: 24px;
        .img_wrap{
          flex-basis: 200px;
          background: #ccc;
          flex-shrink: 0;
          height: 150px;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          .img{
            width: 100%;
            height: 100%;
          }
          .icon{
            position: absolute;
            left: 10px;
            top: 10px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 14px;
            background: linear-gradient(90deg, red, #ff774a);
            color: #fff;
          }
        }
      }
    }
    </style>
