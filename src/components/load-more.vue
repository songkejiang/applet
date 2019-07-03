<template>
  <div class='loadmore'>
    <!-- <div class="loading"  v-show='loadMoreLoading && !loading && reachBottom'> -->
      <!-- <img src="/static/images/loading.gif" class="loadingImg" mode='widthFix'> -->
      <!-- 正在加载。。。 -->
    <!-- </div> -->
    <div v-show='loadall&& listLen>=1'>
      已经全部加载完毕
    </div>
  </div>

</template>
<script>
// import { EventBus } from './eventbus'
import { mapState } from 'vuex'
import { throttle } from '@/utils'
export default {
  props: {
    pageNum: {
      default: 1,
      type: Number
    },
    totalPages: {
      default: 1,
      type: Number
    },
    listLen: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      loadall: false,
      reachBottom: false
    }
  },
  watch: {
    loadMoreLoading (v) {
      this.loadall = false
      if (!v) {
        this.reachBottom = v
      }
    }
  },
  computed: {
    ...mapState(['loadMoreLoading', 'showInvalid', 'loading'])
  },
  methods: {
    onReachBottom: throttle(2000, true, function (v) {
      this.reachBottom = true
      if (this.pageNum > 200) return
      if (this.totalPages > this.pageNum) {
        wx.vibrateShort()
        this.$emit('load')
      } else {
        this.loadall = true
      }
    })
  }
}
</script>
<style lang='less'>
.loadmore{
  text-align: center;
  font-size: 24px;
  .loading{
    position: absolute;
    width: 100%;
  }
  .loadingImg{
    width:30px;
    height: 30px;
    vertical-align: middle
  }
}

</style>
