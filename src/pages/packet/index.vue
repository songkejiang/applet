<template>
  <mt-scroll-view
    :listLen = 'couponsList.length'
    :totalPages= 'totalPages'
    :pageNum= 'pageNum'
    @load='loadMore'
    @fresh='fresh'
    ref='scrollView'
  >
  <div class="coupons-list">
    <div class="item" v-for="(item, index) in couponsList" :key='index'>
      <div class="title" :class="item.status!='B'?'valid':''">{{item.name|| ''}}</div>
      <div class="tips">
        <div class="textwrap">
          <div class="price" :class="item.status!='B'?'valid':''" v-if="item.type!=='PERCENT'">
            <span>￥</span>{{item.money}}
          </div>
          <div class="price" :class="item.status!='B'?'valid':''" v-if="item.type=='PERCENT'">
            {{item.money/10}} <span style="font-size:15px">折</span>
          </div>
          <div class="discount" :class="item.status!='B'?'valid':''" v-if="item.type=='FULL'">满{{item.typeRule}}元可用</div>
        </div>
        <div class="use"  v-if="item.status=='B'"  @click="useCoupon(item.id)">立即使用</div>
        <div class="use" :class="item.status!='B'?'valid':''" v-if="item.status=='A'" >已过期</div>
        <div class="use" :class="item.status!='B'?'valid':''" v-if="item.status=='E'" >已失效</div>
      </div>
      <div class="divide">
        <div class="line"></div>
      </div>
      <div class="info" :class="item.status!='B'?'valid':''" v-if="item.useType =='object'">
       仅限指定内容可用
      </div>
      <div class="info" :class="item.status!='B'?'valid':''" v-if="item.useType =='label'">
       仅限指定科室可用
      </div>
      <div class="info" :class="item.status!='B'?'valid':''">
        有效期至：{{item.useEndTime}}
      </div>
    </div>
  </div>
  </mt-scroll-view>
</template>
<script>
  import mtScrollView from '@/components/mt-scroll-view'
  export default {
    components: {
      mtScrollView
    },
    data () {
      return {
        pageNum: 1,
        pageSize: 30,
        totalPages: 0,
        type: '',
        list: []
      }
    },
    onLoad (options) {
      this.$store.commit('loading', true)
      this.type = options.type
      this.id = options.id
      this.load = false
      if (options.type) {
        this.getDataHasType()
      } else {
        this.getData()
      }
    },
    computed: {
      couponsList () {
        this.cache = this.cache || []
        if (!this.load) {
          this.cache = this.list.slice()
        } else {
          this.cache.push(...this.list)
        }
        return this.cache
      }
    },
    methods: {
      fresh () {
        this.cache = []
        this.load = false
        if (this.type) {
          this.getDataHasType()
        } else {
          this.getData()
        }
      },
      loadMore () {
        this.load = true
        this.getData(++this.pageNum)
      },
      useCoupon (id) {
        if (this.type) {
          this.$store.commit({
            type: 'SET_COUPON_ID',
            couponId: id
          })
          wx.navigateBack()
        } else {
          wx.reLaunch({
            url: '/pages/index/main'
          })
        }
      },
      getData (pageNum) {
        pageNum = pageNum || 1
        this.$http.post(`/user/coupons`, {
          pageNum: pageNum,
          pageSize: this.pageSize
        }, {loading: false}).then(res => {
          this.list = res.data.map((item) => {
            item.useEndTime = this.$formateDate('yyyy.MM.dd', item.useEndTime)
            return item
          })
          this.pageNum = res.pageNum
          this.totalPages = res.totalPages
        })
      },
      getDataHasType () {
        console.log('load', this.load)
        if (!this.load) {
          this.$store.commit('loading', true)
        }
        this.$http.post(`/user/coupons/noPage`, {
          serviceId: this.id,
          serviceType: this.type.toUpperCase() // 类型：VIDEO /LIVE /SERIES （视频/直播/系列课程）
        }).then(res => {
          this.list = res.data.map((item) => {
            item.useEndTime = this.$formateDate('yyyy.MM.dd', item.useEndTime)
            return item
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .coupons-list{
    background: #e4e7ed;
    padding: 30px;
    .item{
      padding: 30px;
      background: #fff;
      border-radius: 10px;
      margin-bottom: 20px;
      .title{
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 20px;
        &.valid{
          color: #ccc;
        }
      }
      .tips{
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .textwrap{
          display: flex;
          align-items: baseline;
        }
        .price{
          font-size: 58px;
          color: #FF244E;
          font-weight: 700;
          margin-right: 36px;
          span{
            font-size: 24px;
          }
          &.valid{
            color: #ccc;
          }
        }
        .discount{
          font-size: 24px;
          margin-right: 90px;
          &.valid{
            color: #ccc;
          }
        }
        .use{
          font-size: 26px;
          padding: 10px 20px;
          line-height: 1em;
          background: #F62E4B;
          color: #fff;
          border-radius: 100px;
          &.valid{
            color: #fff;
            background: #bbb;
          }
        }
      }
      .divide{
        height: 30px;
        position: relative;
        margin: 0 -30px;
        .line{
          border-bottom: 2px dashed #ccc;
          position: absolute;
          left: 0;
          right: 0;
          top: 14px;
        }
        &:before{
          content: '';
          width: 30px;
          height: 30px;
          background: #e4e7ed;
          position: absolute;
          left: -15px;
          top: 0;
          border-radius: 50%;
        }
        &:after{
          content: '';
          width: 30px;
          height: 30px;
          background: #e4e7ed;
          position: absolute;
          right: -15px;
          top: 0;
          border-radius: 50%;
        }
      }
      .info{
        font-size: 26px;
        color: #8b8fa0;
        margin-top: 10px;
        font-weight: normal;
        &.valid{
          color: #ccc;
        }
      }
    }
  }
</style>
