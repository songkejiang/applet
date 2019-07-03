<template>
  <div class="series" v-if='list.length'>
      <div class="text" v-if='oneLabelId==-1'>
        精品课程
        <span class="lookmore" v-if='list.length>1' @click="jump('/pages/high-quality-more/main?oneLabelId=-1')">查看更多</span>
      </div>
      <div class="text" v-else>
        系列课程
        <span class="lookmore" v-if='list.length>1' @click='jump(`/pages/high-quality-more/main?oneLabelId=${oneLabelId}&secondLabelId=${secondLabelId}`)'>查看更多</span>
      </div>
      <div class="content">
        <div class="collect_item" v-for='(item, index) in list' :key='index' @click='jumpPage("/pages/series-detail/main?seriesId="+item.seriesId)'>
          <div class="img_wrap">
            <img :src="item.listCoverPhoto?item.listCoverPhoto:item.coverPhoto" alt="" class="img" mode='aspectFill'>
          </div>
          <list-card :item='item'/>
        </div>
      </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import jumpPage from '@/mixins/jumpPage'
import listCard from '@/components/list-card'
export default {
  components: {
    listCard
  },
  mixins: [jumpPage],
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
      list: []
    }
  },
  watch: {
    oneLabelId (n, o) {
      if (n !== o) {
        this.$store.commit('loading', true)
        this.getData()
      }
    },
    secondLabelId (n, o) {
      if (n !== o) {
        this.getData()
      }
    }
  },
  computed: {
    ...mapState([
      'listLen'
    ])
  },
  methods: {
    ...mapActions([
      'getSeriesRecmmend',
      'getSeriesPage'
    ]),
    jump (v) {
      wx.navigateTo({
        url: v
      })
    },
    getData () {
      if (this.oneLabelId !== -1) {
        this.getSeriesPage({
          pageSize: 4,
          pageNum: 1,
          oneLabelId: this.oneLabelId !== -1 ? this.oneLabelId : null,
          twoLabelId: this.secondLabelId !== -1 ? this.secondLabelId : null
        }).then((res) => {
          this.list = res.data
        })
      } else {
        this.getSeriesRecmmend({
          code: 'L_H_SERIES',
          pageNum: 1,
          pageSize: 4
        }).then((res) => {
          console.log(res)
          this.list = res.data
        })
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
      // margin-top: 25px;
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
          margin-right: 20px;
          .img{
            width: 100%;
            height: 100%;
          }
        }
        .img_text{
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          padding-left: 20px;
          flex-grow: 1;
          .title{
            font-size: 28px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .mainSpeak{
            color:#8b8fa0;
            font-size: 26px;
            display: flex;
            justify-content: space-between;
            line-height: 1em;
            .price{
              color: #1c90fe;
              font-size: 28px;
              font-weight: 500;
              white-space: nowrap;
              padding-right: 20px;
            }
            .author{
              color:#8b8fa0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowra
            }
          }
        }
      }
    }
</style>
