<template>
    <div>
      <div class="labelTab" id='series'>
        <label-tab :key='1' ref='labelTab' firstName='全部' selectIndex='1' @oneLabelChange='oneLabelChange' @secondLabelChange='secondLabelChange' @click='handleTabClick'></label-tab>
      </div>
      <mt-scroll-view
        :scrollViewHeight='scrollViewHeight'
        :listLen = 'seriesPageList.length'
        :totalPages= 'totalPages'
        :pageNum= 'pageNum'
        @load='loadMore'
        @fresh='fresh'
        ref='scrollView'
        >
      <div id='series_content'>
      <div class="vip-live" >
        <div class="content">
          <div class="collect_item" v-for='(item, index) in seriesPageList' :key='index' @click='jumpPage("/pages/series-detail/main?seriesId="+item.seriesId)'>
            <div class="img_wrap">
              <img :src="item.listCoverPhoto?item.listCoverPhoto:item.item.coverPhoto" alt="" class="img" mode='aspectFill'>
              <!-- <span class="icon">
                  直播
                </span> -->
            </div>
            <div class="img_text">
              <div class="leftpart">
                <div class="title">{{item.title}}</div>
                <div class='mainSpeak'>主讲：{{item.authorName}}</div>
              </div>
              <div class="price">
                <div class="num" v-if ="item.chargeType === 'yes'">
                  <span>¥ </span><span>{{item.price}}</span>
                </div>
                <div class="num" v-else>
                  免费
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
    </mt-scroll-view>
  </div>
  </template>
  <script>
  import labelTab from '@/components/label-tab'
  import jumpPage from '@/mixins/jumpPage'
  import mtScrollView from '@/components/mt-scroll-view'
  export default {
    mixins: [jumpPage],
    components: {
      labelTab,
      mtScrollView
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
        cache: [],
        list: [],
        scrollViewHeight: 'calc(100vh - 64rpx)'
      }
    },
    computed: {
      seriesPageList () {
        if (this.list) {
          if (!this.load) {
            this.cache = this.list.slice()
          } else {
            this.cache.push(...this.list)
          }
        }
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
        await this.getData()
        this.$refs.scrollView.scrollTo('series_content')
      },
      async secondLabelChange (v) {
        this.$store.commit('loading', true)
        this.load = false
        this.secondLabelId = v.id
        await this.getData()
        this.$refs.scrollView.scrollTo('series_content')
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
            pageSize: 18,
            twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
          }
        } else {
          params = {
            pageNum: pageNum || 1,
            pageSize: 18,
            oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null
          }
        }
        let res = await this.$http.post(`/open/series/page`, params, {loading: false})
        this.list = res.data
        this.pageNum = res.pageNum
        this.totalPages = res.totalPages
      }
    },
    onLoad () {
      this.load = false
      this.$store.commit('loading', true)
      this.cache = []
      this.getData()
    }
  }
  </script>
  <style scoped lang='less'>
      .vip-live{
        background: #fafafc;
        font-size: 30px;
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
          width: 100%;
          margin-bottom: 24px;
          padding: 20px 30px;
          background: #fff;
          .img_wrap{
            background: #ccc;
            flex-shrink: 0;
            height: 400px;
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
          .img_text{
            display: flex;
            .leftpart {
              display: flex;
              justify-content: space-around;
              flex-direction: column;
              flex-grow: 1;
            }
            .title{
              font-size: 28px;
              font-weight: 700;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              padding:20px 0px  10px 0;
              -webkit-box-orient: vertical;
            }
            .mainSpeak{
              color:#8b8fa0;
              font-size: 26px;
              display: flex;
              justify-content: space-between;
            }
            .price{
              color: #1c90fe;
              font-size: 28px;
              font-weight: 500;
              white-space: nowrap;
              padding-right: 20px;
              display: flex;
              align-items: center;
              .num {
                background: #deeefc;
                border-radius: 50px;
                padding: 0px 20px;
                line-height: 50px;
                height: 50px;
                box-sizing: border-box;
                font-weight: 600;
              }
            }
          }
        }
      }
  </style>
