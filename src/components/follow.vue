<template>
  <div @click="handlerClick" class="follow btn">{{followStatus ? '取消关注' : '+ 关注'}}</div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    info: Object
  },
  watch: {
    '$store.state.token' (v) {
      this.getFollowStatus({
        type: 'GET_FOLLOW_STATUS'
      })
    }
  },
  methods: {
    handlerClick () {
      this.setFollowStatus({
        followId: this.info.userId || this.info.roomUserId,
        operate: this.followStatus ? 'CANCEL' : 'FOLLOW'
      })
    },
    ...mapActions([
      'getFollowStatus',
      'setFollowStatus'
    ])
  },
  computed: {
    ...mapState({
      followStatus: 'followStatus'
    })
  },
  onLoad () {
    this.getFollowStatus({
      followId: this.info.userId || this.info.roomUserId,
      type: 'GET_FOLLOW_STATUS'
    })
  }
}
</script>
<style lang="less" scoped>
  .follow.btn{
    background: none;
    border: none;
    border: 2px solid #0078FF;
    border-radius: 52px;
    color: #fff;
    background: #0078FF;
    font-size: 26px;
    height: 52px;
    width: 140px;
    line-height: 52px;
    text-align: center;
    flex: 0 0 auto;
  }
</style>
