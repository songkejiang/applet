<template>
      <mt-scroll-view
        :listLen = 'videoRecommendList.length'
        :totalPages= 'totalPages'
        :pageNum= 'pageNum'
        @load='loadMore'
        @fresh='fresh'
        >
      <div class="vip-live">
        <div class="content">
          <div class="collect_item" v-for='(item, index) in videoRecommendList' :key='index' @click='jumpPage("/pages/series-detail/main?seriesId="+item.seriesId)'>
            <div class="img_wrap">
              <img :src="item.coverPhoto" alt="" class="img" mode='aspectFill'>
            </div>
            <list-card :item='item'/>
        </div>
      </div>
    </div>
    </mt-scroll-view>
  </template>
  <script>
  import labelTab from '@/components/label-tab'
  import jumpPage from '@/mixins/jumpPage'
  import mtScrollView from '@/components/mt-scroll-view'
  import { mapActions } from 'vuex'
  import listCard from '@/components/list-card'
  export default {
    mixins: [jumpPage],
    components: {
      labelTab,
      mtScrollView,
      listCard
    },
    data () {
      return {
        pageNum: 1,
        totalPages: 0,
        list: [],
        paddingTop: 18
      }
    },
    computed: {
      videoRecommendList () {
        if (this.$store.state.videoRecommendList) {
          let videoRecommendList = this.$store.state.videoRecommendList.data.slice()
          return videoRecommendList
        }
        return []
      }
    },
    methods: {
      ...mapActions([
        'getVideoRecmmend'
      ]),
      fresh () {
        this.load = false
        this.getData()
      },
      loadMore () {
        this.load = true
        this.getData(++this.pageNum)
      },
      getData (pageNum) {
        this.getVideoRecmmend({
          code: 'V_H_VIDEO',
          pageNum: pageNum || 1,
          pageSize: 18
        }).then((res) => {
          this.pageNum = res.pageNum
          this.totalPages = res.totalPages
        })
      }
    },
    onLoad (options) {
      this.$store.commit('loading', true)
      this.cache = []
      this.load = false
      this.getData()
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
