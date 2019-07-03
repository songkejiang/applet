<template>
<mt-scroll-view
  :showInvalidPic='false'
  :listLen = 'listLen'
  :totalPages= 'pageInfo.totalPages'
  :pageNum= 'pageInfo.pageNum'
  @load='loadMore'
  @scroll='onPageScroll'
  @fresh='onFresh'
  ref='scrollView'
>
  <div class="home">
    <div id='recommendHeight'>
        <swiper class="swiper" v-if='sliderPic.length'  indicator-dots="true" :style="{'height':height}" autoplay="true" circular='true' interval="5000" duration="1000">
          <swiper-item v-for="(item, i) in sliderPic"  :key="i" @click="jump(item)">
            <img  :style="{'height':height}"  :src="item.banner" mode='widthFix' class="slide-image"/>
          </swiper-item>
        </swiper>
        <div class="lives_wrap">
          <div class="live_item" @click='jumpPage("/pages/vip-live/main?videoid=123")'>
            <img src="/static/images/viplive.png" alt="">
            <div class="text">大咖直播</div>
          </div>
          <div class="live_item" @click='jumpPage("/pages/meeting-live/main")'>
            <img src="/static/images/meetinglive.png" alt="" >
            <div class="text">
              会议直播
            </div>
          </div>
          <div class="live_item" @click='jumpPage("/pages/video/main")'>
            <img src="/static/images/video.png" alt="">
            <div class="text">
              视频课程
            </div>
          </div>
          <div class="live_item" @click='jumpPage("/pages/series/main")'>
            <img src="/static/images/series.png" alt="" >
            <div class="text">系列课程</div>
          </div>
        </div>
        <div class="mycollect" v-if='myCollect.length' >
          <div class="text" @click ='onFresh'>
            <img src="/static/images/collect.png" alt="" mode='widthFix'>
            我的关注
             <span class="onliving">{{myCollect.length}}人正在直播
             <img src="/static/images/current_live_gif.gif" alt="" mode='widthFix'>
            </span>
          </div>
          <div class="content">
            <div class="collect_item" v-for='(item, index) in myCollect' :key='index' @click='jumpPage("/pages/live-detail/main?videoId="+item.id)'>
              <div class="img_wrap">
                <img :src="item.coverPhoto" alt="" class="img"  mode='aspectFill'>
              </div>
              <div class="img_text">
                <div class="title">{{item.title}}</div>
                <div class='mainSpeak'>主讲：{{item.authorName}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="todaylive" v-if='todayLives.length'>
          <div class="text">
            <img src="/static/images/todaylive.png" alt="" mode='widthFix'>
            今日直播
            <span v-if='todayLives.length>0' @click='jumpPage("/pages/live-today-more/main")' class="lookmore">查看更多</span>
          </div>
          <div class="content">
            <swiper class="swiper"  style='height:200rpx' autoplay="true" circular='true' interval="8000"  duration="500">
              <swiper-item v-for="(item, index) in todayLives"  :key="index">
                <div class="content_item" @click='jumpPage("/pages/live-detail/main?videoId="+item.id)'>
                  <div class="img_wrap">
                    <img :src="item.userPic" alt="" class="img"  mode='widthFix'>
                  </div>
                  <div class="img_text">
                    <div class="title">
                      <span class="icon" v-if="item.liveStatus==='play'">直播</span>
                      <span class="icon ready" v-else>预告</span>
                      {{item.title}}
                    </div>
                    <div class='mainSpeak'>
                      主讲：{{item.authorName}}
                      <span class="living" v-if="item.liveStatus === 'play'">正在直播中</span>
                      <span class="living" v-else>开播时间:{{item.startTime}}</span>
                    </div>
                  </div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
    </div>
<!-- 热门推荐 -->
    <div class="hotRecommend" id='hotRecommend' :style="{paddingTop:fixed?paddingTop:0}">
      <div :class="{fixtop:fixed}"  id='fixtop'>
        <div class="text">
          <img src="/static/images/recommend_liveHeader.png" alt="" mode='widthFix'>
          热门推荐
        </div>
        <label-tab ref='labelTab'  @oneLabelChange='oneLabelChange' @secondLabelChange='secondLabelChange'></label-tab>
      </div>
      <div class="content" id='content'>
        <recommend ref='recommend' :oneLabelId='oneLabelId' :secondLabelId='secondLabelId'  :currentId='oneLabelId'></recommend>
      </div>
      <div  v-if='listLen===0 && !loading' class="invalidImgWrap" :style="{'height': minHeight}">
        <img src="/static/images/no-schedule.png" alt=""  mode='widthFix'>
        <span>亲，还没有内容哦～</span>
      </div>
      <div v-if='loading' class="invalidImgWrap" @touchmove.prevent.stop :style="{'height': minHeight}">
        <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
      </div>
    </div>
   </div>
</mt-scroll-view>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import labelTab from '@/components/label-tab'
import mtScrollView from '@/components/mt-scroll-view'
import recommend from './recommend'
// import otherLabel from './otherLabel'
import jumpPage from '@/mixins/jumpPage'
export default {
  mixins: [jumpPage],
  components: {
    labelTab,
    recommend,
    mtScrollView
  },
  data () {
    return {
      sliderPic: [],
      height: 0,
      fixed: false,
      oneLabelId: -1,
      secondLabelId: -1,
      paddingTop: 0,
      activeIndex: 0,
      activeSwiperIndex: 0,
      duration: 500,
      scroll: 0,
      minHeight: '100vh'
    }
  },
  computed: {
    ...mapState([
      'listLen', 'pageInfo', 'loading'
    ]),
    myCollect () {
      return this.$store.state.collectList || []
    },
    todayLives () {
      let todayLiveList = this.$store.state.todayLiveList
      return (todayLiveList && todayLiveList.slice().map((item) => {
        return Object.assign(item, {
          startTime: this.$formateDate('hh:mm', item.startTime)
        })
      })) || []
    }
  },
  methods: {
    ...mapActions([
      'getMycollect',
      'getTodyLive'
    ]),
    jump (item) {
      if (item.type === 'live') {
        this.jumpPage('/pages/live-detail/main?videoId=' + item.typeId)
      }
      if (item.type === 'video') {
        this.jumpPage('/pages/video-detail/main?videoId=' + item.typeId)
      }
      if (item.type === 'series') {
        this.jumpPage('/pages/series-detail/main?seriesId=' + item.typeId)
      }
    },
    onFresh () {
      this.getData()
      this.loadMore(true)
    },
    loadMore (fresh) {
      this.$refs.recommend.loadMore(fresh)
    },
    async getBanner () {
      await this.$http
        .get('/open/live/home/banner', {loading: true})
        .then(res => {
          this.sliderPic = res.data.filter((item) => {
            return (item.type === 'video' || item.type === 'live' || item.type === 'series')
          })
        })
    },
    imageLoad () {
      let viewWidth = wx.getSystemInfoSync().windowWidth
      let viewHeight = viewWidth / 750 * 250
      viewHeight = viewHeight > 170 ? 170 : viewHeight
      this.height = viewHeight + 'px'
    },
    getFixtop () {
      this.query = wx.createSelectorQuery()
      this.query.select('#recommendHeight').boundingClientRect((res) => {
        this.top = res.height
      }).exec()
    },
    oneLabelChange ({item, index}) {
      this.oneLabelId = item.id
      this.secondLabelId = -1
      this.activeIndex = index
      this.setHeight()
      clearTimeout(this.timer)
      setTimeout(() => {
        if (this.fixed) {
          this.$refs.scrollView.scrollTo('hotRecommend')
        }
      })
    },
    secondLabelChange (v) {
      this.$store.commit('loading', true)
      this.secondLabelId = v.id
      this.setHeight()
      setTimeout(() => {
        if (this.fixed) {
          this.$refs.scrollView.scrollTo('hotRecommend')
        }
      })
    },
    setHeight () {
      if (this.fixed) {
        if (this.oneLabelId === -1) {
          this.minHeight = 'calc(100vh - 166rpx)'
          this.paddingTop = '166rpx'
        } else {
          this.minHeight = 'calc(100vh - 248rpx)'
          this.paddingTop = '248rpx'
        }
      } else {
        this.paddingTop = '0px'
      }
    },
    setPaddingTop () {
      if (this.fixed) {
        if (this.oneLabelId === -1) {
          this.paddingTop = '166rpx'
        } else {
          this.paddingTop = '248rpx'
        }
      } else {
        this.paddingTop = '0px'
      }
    },
    onPageScroll (e) {
      this.scrollTop = e.target.scrollTop
      this.top = this.top ? this.top : 0
      if (this.top - e.target.scrollTop <= 0) {
        this.fixed = true
      } else {
        this.fixed = false
      }
      this.setPaddingTop()
    },
    async getData () {
      await this.getBanner()
      await this.getTodyLive()
      if (this.$store.state.token) {
        await this.getMycollect()
      } else {
        this.$store.commit({
        type: 'SETMYCOLLECT',
        collectList: []
      })
      }
      this.imageLoad()
      this.setPaddingTop()
      setTimeout(() => {
        this.getFixtop()
      }, 400)
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    // return {
    //   title: '212121212',
    //   path: '/pages/index/main',
    //   imageUrl: 'http://store-pic.medmeeting.com/FmrwrCAb5QrIg-iE6xG02KjyPwES'
    // }
  },
   onLoad () {
    this.$store.commit('loading', true)
    this.minHeight = 'calc(100vh - 166rpx)'
    this.getData()
  }
}
</script>
<style scoped lang='less'>
  .home{
    background: #fafafc;
    position: relative;
    .lives_wrap{
      background: #fff;
      display: flex;
      .live_item {
        flex-shrink: 1;
        flex-basis: 25%;
        text-align: center;
        font-size: 25px;
        padding: 30px 20px;
        box-sizing: border-box;
        .text {
          color: #27344c;
        }
        img{
          width: 40%;
          height: 60px;
          margin-bottom: 16px;
        }
      }
    }
    .mycollect{
      margin-top: 25px;
      background: #fff;
      padding: 0 40px 30px;
      font-size: 30px;
      .text {
        padding: 20px 0;
        box-sizing: border-box;
        .lookmore{
          color: #1c90fe;
          font-size: 25px;
          float: right
        }
        .onliving{
          font-size: 20px;
          color: #8b8fa0;
          img{
            width: 24px;
            height: 20px;
            vertical-align: baseline;
          }
        }
        img{
          width: 38px;
          height: 38px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      .collect_item{
        display: flex;
        margin-bottom: 24px;
        .img_wrap{
          flex-basis: 250px;
          background: #ccc;
          flex-shrink: 0;
          height: 150px;
          border-radius: 15px;
          overflow: hidden;
          margin-right:20px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .img_text{
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          .title{
            font-size: 28px;
            text-overflow: ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .mainSpeak{
            color:#8b8fa0;
            font-size: 25px;
          }
        }
      }
    }
    .todaylive {
      margin-top: 25px;
      margin-bottom: 25px;
      background: #fff;
      font-size: 30px;
      .text {
        padding: 20px 30px;
        box-sizing: border-box;
        margin-bottom: 20px;
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
          height: 38px;
          margin-right: 10px;
        }
      }
      .content_item{
        display: flex;
        flex-direction: row-reverse;
        padding: 22px;
        box-shadow:#cce2fb 0 0 30px;
        border-radius: 20px;
        margin: 10px 30px;
        .img_wrap{
          flex-basis: 120px;
          background: #ccc;
          flex-shrink: 0;
          height: 120px;
          border-radius: 15px;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .img_text{
          display: flex;
          flex-grow: 1;
          justify-content: space-between;
          flex-direction: column;
          padding-right: 20px;
          .title{
            font-size: 28px;
            text-overflow: ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            .icon{
              display: inline-block;
              font-size: 18px;
              color: #fff;
              background: linear-gradient(90deg, #ff1f18, #ff7549);
              border-radius: 20px;
              padding: 0 10px;
              &.ready{
                background: linear-gradient(90deg, #4961fe, #0ca1fe );
              }
            }
          }
          .mainSpeak{
            color:#8b8fa0;
            font-size: 23px;
            .living {
              float: right;
              color: #1c90fe;
            }
          }
        }
      }
    }
    .hotRecommend{
      min-height: 100vh;
      font-size: 30px;
      position: relative;
      box-sizing: border-box;
      .content{
        background: #fff;
      }
      .fixtop{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        background: #fff;
        z-index: 1000;
      }
      .paddingTop{
        padding-top: 160px
      }
      .text {
        padding: 20px 30px 40px;
        box-sizing: border-box;
        background: #fff;
        img{
          width: 30px;
          height: 30px;
          margin-right: 10px;
          vertical-align: middle;
        }
      }
      .invalidImgWrap{
        width: 100%;
        height: 100%;
        z-index: 10;
        display: flex;
        align-items: center;
        background: #fff;
        justify-content: center;
        flex-direction: column;
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
    }
  }
.slide-image{
  width: 100vw;
}
</style>
