<template>
  <scroll-view scroll-y class="detail-container" style="height: 100%">
    <div class="live-des-container">
      <img
        :src="info.userPic ? info.userPic : defaultAvatar"
        height="100%" width="100%" class="avatar">
      <div class="des">
        <div class="name-people-container">
          <div class="des-name">
            {{info.userName}}
          </div>
          <p class="name">{{info.userTitle}}</p>
        </div>
        <follow  :info='info'/>
      </div>
    </div>
    <div class="live-type-container">
      <h1>{{info.title}}</h1>
      <p>
        讲师：{{info.authorName}} （{{info.authorTitle}}）
        <span v-if="info.price">价格：{{info.price}}</span>
      </p>
      <p>时间：{{info.startTime}}</p>
    </div>
    <div class="live-details-container">
      <p class="desc">{{des.text}}</p>
      <div class="img_wrap" v-if='des.imgs'>
        <img v-for='(img,index) in des.imgs' mode='widthFix' :key='index' :src="img" alt="">
      </div>
    </div>
  </scroll-view>
</template>

<script>
  import follow from '@/components/follow'
  export default {
    components: {
      follow
    },
    data () {
      return {
        defaultAvatar: 'http://store-pic.medmeeting.com/FnrnEkS8bj1KXA-DJC3sJZuIJc0k'
      }
    },
    computed: {
      des () {
        try {
          return JSON.parse(this.info.des)
        } catch (e) {
          return { text: this.info ? this.info.des : '' }
        }
      }
    },
    props: {
      info: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style scoped lang="less">
  .detail-container {
    height: 100%;
  }
  .live-des-container {
    position: relative;
    background-color: #fff;
    width: 100%;
    display: flex;
    padding: 20px 20px;
    border-bottom: 2px solid #f0f0f0;
    align-items: center;
    .avatar {
      flex: none;
      width: 84px;
      height: 84px;
      border-radius: 50%;
    }
    .brand {
      display: inline-block;
      position: relative;
      top: -2px;
      margin-left: 12px;
      font-size: 24px;
      padding: 0 12px;
      color: #fff;
      line-height: 32px;
      border-radius: 40px;
      &.play {
        background-color: #ff3a30;
      }
      &.wait {
        background-color: #c0c0c0;
      }
    }
    .des {
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      overflow: hidden;
      padding-left: 30px;
      padding-right: 53px;
      font-size: 30px;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .name-people-container {
        margin-top: 12px;
        font-size: 26px;
        color: #666;
        overflow: hidden;
        .des-name{
          font-size: 30px;
          color: #333;
        }
      }
      .btn{
        border-radius: 50px;
        background: #0078FF;
        color: #fff;
        font-size: 24px;
        height: 52px;
        width: 120px;
        line-height: 52px;
        text-align: center;
        flex: 0 0 auto;
      }
      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .people {
        text-align: center;
        flex: 0 0 auto;
        white-space: nowrap;
        margin-left: 20px;
        margin-right: 12px;
        .num {
          position: relative;
          top: 0;
        }
      }
    }
  }
  .live-type-container {
    background-color: #fff;
    padding: 20px 30px;
    color: #666;
    font-size: 25px;
    border-bottom: 1px solid #f0f0f0;
    p{
      line-height: 40px;
      margin-bottom: 10px;
    }
    h1{
      margin-bottom: 25px;
      font-size: 35px;
      color: #333;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
  .live-details-container {
    background-color: #fff;
    .title {
      padding: 0 20px;
      padding-top: 20px;
      line-height: 80px;
      font-size: 32px;
      font-weight: bold;
    }
    .desc {
      padding: 10px 20px;
      font-size: 28px;
      color: #666;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 54px;
      overflow-x: hidden;
    }
    .img_wrap {
      font-size: 0;
      text-align: center;
      img {
        max-width: 100%;
        width: 100%;
      }
    }
  }
</style>
