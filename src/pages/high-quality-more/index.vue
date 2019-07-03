<template>
      <mt-scroll-view
        :listLen = 'seriesPageList.length'
        :totalPages= 'totalPages'
        :pageNum= 'pageNum'
        @load='loadMore'
        @fresh='fresh'
        >
      <div class="vip-live"  v-if='seriesPageList.length'>
        <div class="content">
          <div class="collect_item" v-for='(item, index) in seriesPageList' :key='index' @click='jumpPage("/pages/series-detail/main?seriesId="+item.seriesId)'>
            <div class="img_wrap">
              <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
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
      seriesPageList () {
        this.cache = this.cache || []
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
      ...mapActions([
        'getSeriesRecmmend',
        'getSeriesPage'
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
        if (this.oneLabelId !== -1) {
          this.getSeriesPage({
            pageSize: 18,
            pageNum: pageNum || 1,
            oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null,
            twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
          }).then((res) => {
            this.list = res.data
            this.pageNum = res.pageNum
            this.totalPages = res.totalPages
          })
        } else {
          this.getSeriesRecmmend({
            code: 'L_H_SERIES',
            pageNum: pageNum || 1,
            pageSize: 18
          }).then((res) => {
            console.log(res)
            this.list = res.data
            this.pageNum = res.pageNum
            this.totalPages = res.totalPages
          })
        }
      }
    },
    onLoad (options) {
      this.$store.commit('loading', true)
      this.oneLabelId = +options.oneLabelId
      this.secondLabelId = +options.secondLabelId
      this.cache = []
      this.load = false
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
              line-height: 1em;
            }
            .price{
              font-size: 28px;
              color: #1c90fe;
              font-weight: 500;
              display: flex;
              white-space: nowrap;
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
