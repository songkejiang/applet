<template>
  <div >
    <div class="labelTab" id='fixtop'>
      <label-tab  ref='labelTab' firstName='全部' selectIndex='1' @oneLabelChange='oneLabelChange' @secondLabelChange='secondLabelChange' @click='handleTabClick'></label-tab>
    </div>
    <mt-scroll-view
      :scrollViewHeight='scrollViewHeight'
      :listLen = 'playingPrograme.length+liveProgramePageList.length'
      :totalPages= 'totalPages'
      :pageNum= 'pageNum'
      @load='loadMore'
      @fresh='fresh'
      ref='scrollView'
    >
    <div class="vip-live"  v-if='playingPrograme.length'>
      <div class="text">
        <img src="/static/images/todaylive.png" alt="" mode='widthFix'>
        正在直播
      </div>
      <div class="content">
        <div class="collect_item" v-for='(item, index) in playingPrograme' :key='index'  @click='jumpPage("/pages/live-detail/main?videoId="+item.id)'>
            <div class="img_wrap">
              <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
                <span class="icon">
                  直播
                </span>
            </div>
            <list-card :item='item' />
          </div>
        </div>
      </div>
      <div class="vip-live" v-if='liveProgramePageList.length'>
        <div class="text">
          <img src="/static/images/liv_advance.png" alt="" mode='widthFix'>
          预告
        </div>
        <div class="content">
          <div class="collect_item" @click='jumpPage("/pages/live-detail/main?videoId="+item.id)' v-for='(item, index) in liveProgramePageList' :key='index'>
              <div class="img_wrap">
                <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
                <span class="icon" v-if="item.liveStatus==='play'">
                    直播
                </span>
                <span class="icon ready" v-else>
                    预告
                </span>
              </div>
              <list-card :item='item' />
          </div>
        </div>
      </div>
   </mt-scroll-view>
  </div>
</template>
<script>
import loadMore from '@/components/load-more'
import mtScrollView from '@/components/mt-scroll-view'
import labelTab from '@/components/label-tab'
import { mapState } from 'vuex'
import jumpPage from '@/mixins/jumpPage'
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
      paddingTop: '58rpx',
      playingPrograme: [],
      list: [],
      scrollViewHeight: 'calc(100vh - 64rpx)'
    }
  },
  computed: {
    ...mapState(['listLen']),
    liveProgramePageList () {
      this.cache = this.cache || []
      if (this.list) {
        if (!this.load) {
          this.cache = this.list.slice()
        } else {
          this.cache.push(...this.list)
        }
      }
      this.cache = this.cache.map((item) => {
        item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
        item.startTime2 = this.$formateDate('yyyy-MM-dd hh:mm', item.startTime)
        return item
      })
      return this.cache
    }
  },
  methods: {
    fresh () {
      this.cache = []
      this.load = false
      this.getData()
    },
    async oneLabelChange ({item, index}) {
      this.$store.commit('loading', true)
      this.load = false
      this.oneLabelId = item.id
      this.secondLabelId = -1
      this.activeIndex = index
      if (index !== 0) {
        this.scrollViewHeight = 'calc(100vh - 146rpx)'
      } else {
        this.scrollViewHeight = 'calc(100vh - 64rpx)'
      }
      await this.isShowInvalid()
      this.$refs.scrollView.scrollTo('vip-live')
    },
    async secondLabelChange (v) {
      this.$store.commit('loading', true)
      this.load = false
      this.secondLabelId = v.id
      await this.isShowInvalid()
      this.$refs.scrollView.scrollTo('vip-live')
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
          programType: 'VIP',
          liveStatus: 'ready',
          twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
        }
      } else {
        params = {
          pageNum: pageNum || 1,
          pageSize: 12,
          programType: 'VIP',
          liveStatus: 'ready',
          oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null
        }
      }
      await this.$http.post(`/liveProgram/page`, params, {loading: false})
        .then(res => {
          this.list = res.data
          this.pageNum = res.pageNum
          this.totalPages = res.totalPages
        })
    },
    async getPlaying () {
      if (this.secondLabelId !== -1 && this.secondLabelId) {
        this.oneLabelId = null
      }
      if (this.oneLabelId !== -1 && this.oneLabelId) {
        this.secondLabelId = null
      }
      await this.$http.post(`/liveProgram/page`, {
        pageNum: 1,
        pageSize: 15,
        liveStatus: 'play',
        programType: 'VIP',
        oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null,
        twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
      }, {loading: false})
        .then(res => {
          this.playingPrograme = res.data
        })
    },
    async isShowInvalid () {
      await this.getPlaying()
      await this.getData()
    }
  },
  onLoad (v) {
    this.$store.commit('loading', true)
    this.isShowInvalid()
  }
}
</script>
<style scoped lang='less'>
    .vip-live{
      background: #fff;
      padding: 0 40px 30px;
      font-size: 30px;
      // font-weight: bold;
      .text {
        padding: 20px 0px;
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
            &.ready{
              background: linear-gradient(90deg, #4961fe, #0ca1fe );
            }
          }
        }
    }
  }
   </style>
