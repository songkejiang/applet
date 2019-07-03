<template>
  <div class="videoDetail" v-if='seriesDetail.seriesId'>
    <div class="videoplayer">
        <player ref='player' :info='seriesDetail' @play="onplay"></player>
    </div>
    <discount :info='seriesDetail'></discount>
    <div class="discount" v-if='seriesDetail.isDiscount&&remaintime>0'>
      <div class="left">
        <div class="newprice">
          ¥{{seriesDetail.price}}
        </div>
        <div class="">
          <div class="text">限时优惠</div>
          <div class="oldprice">
            ¥{{seriesDetail.discountPrice}}
          </div>
        </div>
      </div>
      <div class="right">
        距结束时间<span class="num">{{day}}</span>天<span class="num">{{h}}</span>小时<span class="num">{{m}}</span>分
      </div>
    </div>
    <div class="tabWrap">
      <tab-switch :height='height'>
        <pane label='简介'>
          <series-content  :info='seriesDetail'></series-content>
        </pane>
        <pane label='目录'>
          <series-list ref='seriesList' :info='seriesDetail' @selectSeries="selectSeries"></series-list>
        </pane>
        <pane label='评论'>
          <series-comment ref='seriesComment' :info='seriesDetail'></series-comment>
        </pane>
      </tab-switch>
    </div>
    <pay-footer  @success='paySuccess'  v-if="seriesDetail.chargeType=='yes' && !seriesDetail.payFlag"  type='series' @failed='payFail'  :info='seriesDetail'></pay-footer>
  </div>
  <div v-else class="invalidImgWrap">
    <img src="http://cdn.medmeeting.com/static/sponsor/loading.gif" alt=""  mode='widthFix'>
  </div>
</template>
<script>
import player from '@/components/video-player'
import tabSwitch from '@/components/tabs'
import Pane from '@/components/tabs/pane'
import payFooter from '@/components/pay-footer'
import SeriesContent from './series-content'
import SeriesList from './series-list'
import SeriesComment from './series-comment'
import discount from '@/components/discount'
import { mapActions } from 'vuex'
import mtScrollView from '@/components/mt-scroll-view'
export default {
  components: {
    player,
    Pane,
    tabSwitch,
    payFooter,
    SeriesContent,
    SeriesList,
    SeriesComment,
    discount,
    mtScrollView
  },
  data () {
    return {
      tabIndex: 0,
      selectSeriesInfo: {}
    }
  },
  computed: {
    login () {
      return this.$store.state.token
    },
    seriesDetail () {
      if (this.$store.state.seriesDetail) {
        return Object.assign({}, this.$store.state.seriesDetail.entity, this.selectSeriesInfo)
      }
      return {}
    },
    height () {
      if (this.seriesDetail.chargeType === 'yes' && !this.seriesDetail.payFlag) {
        if (this.seriesDetail.isDiscount && this.seriesDetail.discountEndTime > Date.now()) {
          return '100vh - 422rpx - 100rpx - 110rpx'
        }
        return '100vh - 422rpx - 100rpx'
      }
      return '100vh - 422rpx'
    }
  },
  methods: {
    ...mapActions([
      'getSeriesDetails',
      'getHeadVideo'
    ]),
    selectSeries (seriesInfo, playindex) {
      this.selectSeriesInfo = Object.assign({}, seriesInfo)
      console.log(playindex)
      if (playindex === undefined) return
      this.playindex = playindex
      setTimeout(() => {
        this.onplay()
      }, 500)
    },
    onplay () {
      if (this.seriesDetail.chargeType === 'yes' && !this.seriesDetail.payFlag && !this.seriesDetail.isSee) {
        wx.showToast({
          title: '付费后观看',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.seriesDetail.isShare && !this.seriesDetail.shareRecord) {
        wx.showToast({
          title: '分享后才可以观看哦',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.$refs.player && this.$refs.player.play()
      if (!this.playindex) {
        this.$refs.seriesList.playIndex = 0
      }
    },
    paySuccess () {
      this.getData()
    },
    getData () {
      this.getSeriesDetails({
        seriesId: this.seriesId
      }).then((res) => {
        if (res) {
          setTimeout(() => {
            this.$refs.seriesComment.getData(res)
          }, 300)
          wx.setNavigationBarTitle({
            title: res.title
          })
        }
      })
    }
  },
 onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: this.seriesDetail.shareTitle,
      path: '/pages/series-detail/main?seriesId=' + this.seriesId,
      imageUrl: this.seriesDetail.shareImage
    }
  },
  onShow () {
    if (this.$store.state.from === 'login') {
      this.getData()
      this.$store.commit({
        type: 'PAGE_ORIGIN',
        ORIGIN: ''
      })
    }
  },
  onLoad (options) {
    this.$store.commit({
      type: 'SETSERIESDETAILS',
      seriesDetail: ''
    })
    this.$store.commit('loading', true)
    this.seriesId = options.seriesId
    this.getHeadVideo()
    this.getData()
  }
}
</script>
<style lang='less' scoped>
  .invalidImgWrap{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    background: #fff;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    img{
      width: 35%;
      margin-top: -20px;
      margin-bottom: 20px;
    }
  }
  .videoDetail{
    .videoplayer{
      // position: fixed;
      // width: 100%;
      // top: 0;
      // left: 0;
    }
    .tabWrap{
      // position: fixed;
      // width: 100%;
      // top: 422px;
      // left: 0;
    }
  }
</style>
