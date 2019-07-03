<template>
  <scroll-view class="detail-container" style="height: 100%">
    <div v-for='(item, index) in normalizeData' :key='index'>
      <div class="comment_wrap">
          <span class="avator_wrap">
            <img :src="item.userPic ? item.userPic : userAvatar" width="100%" height="100%">
          </span>
        <div class="comment_main">
          <p>
            <span class="username">{{item.userName}}</span>
            <span class="time">
                {{item.createTime}}
              </span>
          </p>
          <p>
            {{item.content}}
          </p>
        </div>
      </div>
    </div>
    <div v-if='!normalizeData.length' class='noComment'>
      <img src="/static/images/no-schedule.png" mode='widthFix' alt="">
      <span>亲，还没有内容哦～</span>
    </div>
  </scroll-view>
</template>
<script>
  import { mapActions } from 'vuex'
  import * as types from '@/store/mutation-types.js'
  export default {
    components: {
    },
    data () {
      return {
        // normalizeData: [],
        userAvatar: 'http://store-pic.medmeeting.com/FnrnEkS8bj1KXA-DJC3sJZuIJc0k',
        type: types.SET_COMMENT_LIST
      }
    },
    props: {
      info: Object,
      scrollHeight: {
        default: 0,
        type: Number
      }
    },
    methods: {
      lookReply () {
        wx.showModal({
          title: '提示',
          content: '请到App查看',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      ...mapActions([
        'setComments'
      ]),
      getData (v) {
        console.log('videoId', v.videoId)
        if (!v.videoId) return
        this.setComments({
          videoId: v.videoId,
          pageSize: 3,
          pageNum: 1
        })
      }
    },
    computed: {
      normalizeData () {
        let commentList = this.$store.state.commentList
        if (commentList) {
          return commentList.map((item) => {
            item.createTime = this.$formateDate('yyyy-MM-dd hh:mm', item.createTime)
            return item
          })
        }
        return []
      }
    }
  }
</script>
<style lang="less">
  .comment_wrap{
    padding: 20px 20px 0 20px;
    display: flex;
    font-size: 28px;
    .avator_wrap{
      display: inline-block;
      flex: 0 1 80px;
      height: 80px;
      border-radius:50%;
      overflow: hidden;
      width: 0;
      img{
        width: 80px;
        height: 80px;
      }
    }
    .comment_main{
      flex: 1;
      padding-left: 20px;
      .username{
        color: #a8a9b3;
        margin-bottom: 8px;
        display: inline-block;
      }
      .time{
        font-size: 26px;
        float: right;
        color: #a8a9b3;
      }
      .reply{
        color: #a8a9b3;
        font-size: 24px;
      }
    }
  }
  .noComment{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
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
  .detail-container {
    .open-app{
      width: 80%;
      text-align: center;
      background: #0078FF;
      margin: 20px auto;
      border-radius: 100px;
      padding: 16px 0;
      color: #fff;
      position: absolute;
      left: 50%;
      bottom: 20px;
      margin-left: -40%;
      font-size: 32px;
    }
  }
</style>
