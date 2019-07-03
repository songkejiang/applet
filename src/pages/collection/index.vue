<template>
  <tab-switch v-model='a'>
    <pane label='直播' name='1'>
      <live-list ref="liveList"></live-list>
    </pane>
    <pane label='视频' name='2'>
      <video-list ref="videoList"></video-list>
    </pane>
    <pane label='课程'  name='3'>
      <series-list ref="seriesList"></series-list>
    </pane>
  </tab-switch>
</template>
<script>
  import LiveList from './live-list'
  import VideoList from './video-list'
  import SeriesList from './series-list'
  import tabSwitch from '@/components/tabs'
  import pane from '@/components/tabs/pane'
  export default {
    data () {
      return {
        a: '',
        list: []
      }
    },
    methods: {
      init (v) {
        if (this.list.indexOf(v) === -1) {
          if (v === '1') {
            setTimeout(() => {
              this.$refs.liveList && this.$refs.liveList.getData()
            }, 100)
          }
          if (v === '2') {
            this.$refs.videoList && this.$refs.videoList.getData()
          }
          if (v === '3') {
            this.$refs.seriesList && this.$refs.seriesList.getData()
          }
          this.list.push(v)
          this.list = [...new Set(this.list)]
        }
      }
    },
    watch: {
      a (v) {
        console.log(v)
        this.init(v)
      }
    },
    onUnload () {
      this.list = []
      this.$store.commit({
        type: 'SET_COLLECT_LIVE_LIST',
        list: []
      })
      this.$store.commit({
        type: 'SET_COLLECT_VIDEO_LIST',
        list: []
      })
      this.$store.commit({
        type: 'SET_COLLECT_SERIES_LIST',
        list: []
      })
    },
    onLoad () {
      this.a = '1'
    },
    components: {
      tabSwitch,
      pane,
      LiveList,
      VideoList,
      SeriesList
    }
  }
</script>
<style lang="less">
  .tab-content{
    margin-top: 64rpx;
  }
</style>
