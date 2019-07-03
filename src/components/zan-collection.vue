<template>
  <div class="video-opreate" v-if='login'>
    <div class="collection" @click="selectCollect">
      <img  class="icon " v-if="collectionStatus" src="/static/images/star2.png"/>
      <img  class="icon " v-if="!collectionStatus" src="/static/images/star.png"/>
    </div>
    <div @click="selectZan" >
      <img  class="icon zan" v-if="zanStatus" src="/static/images/zan2.png"/>
      <img  class="icon zan" v-if="!zanStatus" src="/static/images/zan.png"/>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    info: {
      default: {},
      type: Object
    },
    type: String,
    id: [String, Number]
  },
  computed: {
    login () {
      return this.$store.state.token
    },
    collectionStatus () {
      return this.$store.state.collectionStatus
    },
    zanStatus () {
      return this.$store.state.zanStatus
    },
    id () {
      if (this.type.toLowerCase() === 'video') {
        return this.info.videoId
      }
      if (this.type.toLowerCase() === 'live') {
        return this.info.id
      }
      if (this.type.toLowerCase() === 'series') {
        return this.info.seriesId
      }
    }
  },
  methods: {
    selectZan () {
      this.setZanStatus({
        type: 'GET_ZAN_STATUS',
        serviceId: this.id,
        serviceType: this.type.toUpperCase()
      })
    },
    selectCollect () {
      this.setCollectionStatus({
        type: 'GET_COLLECTION_STATUS',
        serviceId: this.id,
        serviceType: this.type.toUpperCase()
      })
    },
    ...mapActions([
      'setZanStatus',
      'setCollectionStatus'
    ])
  }
}
</script>
<style lang="less" scoped>
  .video-opreate{
    display: flex;
    justify-content: space-between;
    .collection{
      padding:0 10px;
      margin-right: 30px;
    }
    .zan{
      padding:0 10px;
    }
    img{
      display: inline-block;
      width: 38px;
      height: 38px;
    }
  }
</style>
