<template>
    <scroll-view scroll-y style="height: 100%">
      <div class="live-des-container">
        <img v-if="info.userPic && info.userPic != 'defaultPic'" :src="info.userPic" height="100%" width="100%" class="avatar">
        <img v-else src="/static/images/avator_default.png" height="100%" width="100%" class="avatar">
        <div class="des">
          <div class="name-people-container">
            <div class="des-name">
              {{info.authorName}}
            </div>
            <p class="name">{{info.userTitle}}</p>
          </div>
          <follow  :info='info'/>
        </div>
      </div>
      <div class="live-type-container">
        <h1>{{info.title}}</h1>
        <div class="video-info">
          <span class="play-icon"><img src="http://store-pic.medmeeting.com/FrnBiTJbXcvOdcMMZ1MTdLslF_yV" alt="">{{info.playCount}}次播放</span>
          <zan-cellection type='video' :info='info'/>
        </div>
      </div>
      <div class="live-details-container">
        <p class="desc">{{des.text}}</p>
        <div class="img_wrap" v-if='des.imgs'>
          <img class="img" mode="widthFix" v-for='(img,index) in des.imgs'  :key='index' :src="img" alt=""/>
        </div>
      </div>
    </scroll-view>
</template>
<script>
  import zanCellection from '@/components/zan-collection'
  import follow from '@/components/follow'
  export default {
    components: {
      zanCellection,
      follow
    },
    props: {
      info: {
        type: Object,
        default: {}
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
    }
  }
</script>
<style lang="less">
  .live-des-container {
    background-color: #fff;
    width: 100%;
    display: flex;
    padding: 20px;
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
      height: 32px;
      line-height: 32px;
      border-radius: 40px;
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
        font-size: 26px;
        color: #666;
        overflow: hidden;
        .des-name{
          font-size: 30px;
          color: #333;
        }
      }
      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .area {
      flex: none;
      text-align: right;
    }
    .people {
      line-height: 80px;
      white-space: nowrap;
      width: 110px;
      .num {
        position: relative;
        top: -2px;
      }
    }
  }
  .live-type-container {
    background-color: #fff;
    padding: 20px 30px;
    color: #666;
    font-size: 25px;
    border-bottom: 1px solid #f7f7f7;
    h1{
      margin-bottom: 25px;
      font-size: 35px;
      color: #333;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .video-info{
      display: flex;
      justify-content: space-between;
      line-height: 45px;
      height: 45px;
      .play-icon{
        img{
          width: 26px;
          height: 22px;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
  .live-details-container {
    background-color: #fff;
    .title {
      padding: 0 20px;
      line-height: 80px;
      font-size: 36px;
      border-bottom: 2px solid #f0f0f0;
    }
    .desc {
      padding: 20px;
      color: #666;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 30px;
      line-height: 54px;
      overflow-x: hidden;
    }
    .text {
      text-align: center;
      font-size: 28px;
    }
    .img_wrap {
      text-align: center;
      font-size: 0;
      .img {
        width: 100%;
      }
    }
  }
</style>
