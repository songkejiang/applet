<template>
    <div class="series" v-if='videoList.length'>
      <div class="text" v-if='oneLabelId==-1'>
        精选视频
      </div>
      <div class="text" v-else>
        视频列表
      </div>
      <div class="content">
        <div class="collect_item" v-for='(item, index) in videoList' :key='index' @click='jumpPage("/pages/video-detail/main?videoId="+item.videoId)'>
          <div class="img_wrap">
            <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" :lazy-load='true' class="img" mode='aspectFill'>
          </div>
          <list-card :item='item'/>
        </div>
      </div>
    </div>
</template>
<script>
import loadMore from '@/components/load-more'
import listCard from '@/components/list-card'
import jumpPage from '@/mixins/jumpPage'
import { mapState } from 'vuex'
export default {
  mixins: [jumpPage],
  components: {
    loadMore,
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
      list: []
    }
  },
  watch: {
    oneLabelId (n, o) {
      if (n !== o) {
        this.$store.commit('loading', true)
        this.load = false
        this.getData()
      }
    },
    secondLabelId (n, o) {
      if (n !== o) {
        this.load = false
        this.getData()
      }
    }
  },
  computed: {
    ...mapState([
      'listLen'
    ]),
    videoList () {
      this.cache = this.cache || []
      if (!this.load) {
        this.cache = this.list.slice()
      } else {
        this.cache.push(...this.list)
      }
      this.cache = this.cache.map((item) => {
        item.coverPhoto = item.coverPhoto.indexOf('imageView') > -1 ? item.coverPhoto : this.qiniu(item.coverPhoto, 150)
        return item
      })
      return this.cache
    }
  },
  methods: {
    loadMore (fresh) {
      if (fresh) {
        this.load = false
        this.pageNum = 1
        this.getData()
      } else {
        this.load = true
        this.getData(++this.pageNum)
      }
    },
    getRecommendData (pageNum) {
      this.$http.post('/open/video/get/recommend', {
        code: 'L_H_VIDEO',
        pageNum: pageNum || 1,
        pageSize: 18
      })
        .then(res => {
          this.list = res.data
          this.$store.commit('setpageInfo', {pageNum: res.pageNum, totalPages: res.totalPages})
          this.$store.commit('setListLen', this.$store.state.seriesRecommendList.data.length + res.data.length)
        })
    },
    async getSeriesData (pageNum) {
      let res
      let params
      if (this.secondLabelId !== -1 && this.secondLabelId) {
        params = {
          pageNum: pageNum || 1,
          pageSize: 20,
          twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
        }
      } else {
        params = {
          pageNum: pageNum || 1,
          pageSize: 20,
          oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null
        }
      }
      res = await this.$http.post(`/open/video/page`, params)
      this.$store.commit('setpageInfo', {pageNum: res.pageNum, totalPages: res.totalPages})
      this.$store.commit('setListLen', this.$store.state.seriesPageList.data.length + res.data.length)
      this.list = res.data
    },
    getData () {
      if (this.oneLabelId !== -1) {
        this.getSeriesData()
      } else {
        this.getRecommendData()
      }
    }
  },
  onLoad () {
    this.getData()
  }
}
</script>
<style scoped lang='less'>
 .series{
      background: #fff;
      padding: 0 40px 30px;
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
          overflow: hidden;
          .img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
</style>
