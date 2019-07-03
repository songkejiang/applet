<template>
  <div>
    <div class="labelTab" id='fixtop1'>
      <label-tab :key='1' ref='labelTab' firstName='全部' selectIndex='1' @oneLabelChange='oneLabelChange' @secondLabelChange='secondLabelChange' @click='handleTabClick'></label-tab>
    </div>
  <mt-scroll-view
    :scrollViewHeight='scrollViewHeight'
    :listLen = 'videoPageList.length'
    :totalPages= 'totalPages'
    :pageNum= 'pageNum'
    @load='loadMore'
    @fresh ='fresh'
    ref='scrollView'
  >
  <div class="vip-live" id='history'>
    <div class="collect_item" v-for='(item, index) in videoPageList' :key='index' @click='jumpPage("/pages/video-detail/main?videoId="+item.videoId)'>
      <div class="img_wrap">
        <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
        <!-- <span class="icon">
            直播
          </span> -->
      </div>
      <listCard :item='item'/>
    </div>
  </div>
</mt-scroll-view>
</div>
</template>
<script>
import loadMore from '@/components/load-more'
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
    },
    padtop: String
  },
  data () {
    return {
      pageNum: 1,
      totalPages: 0,
      cache: [],
      throttle: true,
      list: [],
      videoPageList: [],
      scrollViewHeight: ''

    }
  },
  methods: {
    fresh () {
      this.load = false
      this.getData()
    },
    async oneLabelChange ({item, index}) {
      this.$store.commit('loading', true)
      if (index !== 0) {
        this.scrollViewHeight = `calc(100vh - 146rpx - 80rpx - ${this.padtop})`
      } else {
        this.scrollViewHeight = `calc(100vh - 64rpx -  80rpx - ${this.padtop})`
      }
      this.load = false
      this.oneLabelId = item.id
      this.secondLabelId = -1
      await this.getData()
      this.$refs.scrollView.scrollTo('history')
    },
    async secondLabelChange (v) {
      this.$store.commit('loading', true)
      this.load = false
      this.secondLabelId = v.id
      await this.getData()
      this.$refs.scrollView.scrollTo('history')
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
          programType: 'EVENT',
          twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
        }
      } else {
        params = {
          pageNum: pageNum || 1,
          pageSize: 12,
          programType: 'EVENT',
          oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null
        }
      }
      await this.$http.post(`/open/video/page`, params, {loading: false})
        .then(res => {
          this.list = res.data
          this.pageNum = res.pageNum
          this.totalPages = res.totalPages
          this.formData()
        })
    },
    formData () {
      if (this.list) {
        if (!this.load) {
          this.videoPageList = this.list.slice()
        } else {
          this.videoPageList.push(...this.list)
        }
      }
      this.videoPageList = this.videoPageList.map((item) => {
        item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
        return item
      })
    }
  },
  onLoad () {
    this.$store.commit('loading', true)
    this.getData()
    this.scrollViewHeight = `calc(100vh - 64rpx - 80rpx - ${this.padtop})`
  }
}
</script>
<style scoped lang='less'>
    .vip-live{
      background: #fff;
      padding: 25px 40px 30px;
      font-size: 30px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
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
          // height: 60px;
        }
        &::before {
          display: inline-block;
          content: '';
          position: absolute;
          top: 26px;
          left: 0;
          width: 6px;
          height: 30px;
          background: #1c90fe;
          border-radius: 3px;
        }
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
