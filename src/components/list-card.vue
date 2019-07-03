<template>
  <div class="img_text">
    <div class="title">{{item.title}}</div>
    <div class='mainSpeak'>
      <div class="price">
        <div v-if ="item.chargeType === 'yes'">
          <span>¥ </span><span>{{item.price}}</span>
        </div>
        <div v-else  class="free">
          免费
        </div>
      </div>
      <div v-if="item.liveStatus && item.liveStatus ==='ready'" class='author'>{{item.startTime2}}</div>
      <div v-else class='author'>主讲:{{item.authorName}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  }
}
</script>
<style lang="less" scoped>
  .img_text{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    flex-grow: 1;
    .title{
      font-size: 28px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      height: 2.5em;
      margin-bottom: 20px;
      padding: 10px 0;
      -webkit-box-orient: vertical;
    }
    .mainSpeak{
      color:#8b8fa0;
      font-size: 26px;
      display: flex;
      justify-content: space-between;
      height: 35px;
      line-height: 35px;
      .price{
        color: #1c90fe;
        font-size: 30px;
        font-weight: 700;
        white-space: nowrap;
        padding-right: 20px;
        .free{
          white-space:nowrap;
          font-size: 28px;
        }
      }
      .author{
        color:#8b8fa0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
      }
      .time{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
