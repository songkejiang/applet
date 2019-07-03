<template>
  <div v-if="invalide==0" >
   <Login />
  </div>
  <div v-else-if="invalide==1" class="med-user-container">
    <div class="user-header-container">
      <div class="avatar-container">
        <img :src="(userInfo.userPic === 'defaultPic' || userInfo.userPic === '' ) ? 'https://cdn3.medmeeting.com/static/mobile/img/default-avatar.png' :  userInfo.userPic "  class="avatar">
      </div>
      <div class="user-info">
        <p class="department">{{userInfo.name}}</p>
        <p class="phone">{{userInfo.mobilePhone}}</p>
      </div>
    </div>
    <div class="nav">
      <div class="item" @click="toOrder">
        <span><img :src="orderIcon"  mode='widthFix' alt="">我的订单</span>
        <i class="right-row-icon"><img :src="rightRow" alt=""></i>
      </div>
      <div class="item" @click="toCollect">
        <span><img :src="collectIcon"  mode='widthFix' alt="">我的收藏</span>
        <i class="right-row-icon"><img :src="rightRow" alt=""></i>
      </div>
      <div class="item" @click="toPacket">
        <span><img :src="packetIcon"  mode='widthFix' alt="">我的红包</span>
        <i class="right-row-icon"><img :src="rightRow" alt=""></i>
      </div>
    </div>
    <div class="logout-btn">
      <button class="grad-btn" @click="logout">退出登录</button>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import jumpPage from '@/mixins/jumpPage'
  import Login from '../login'
  export default {
    components: {
      Login
    },
    mixins: [jumpPage],
    data () {
      return {
        orderIcon: 'http://store-pic.medmeeting.com/FpXwWuI4hOUDX-WbMYFutvM1jVWk',
        collectIcon: 'http://store-pic.medmeeting.com/FvCAnsnvxDRs8bxew2Yh4KcH6ZDC',
        packetIcon: 'http://store-pic.medmeeting.com/FgIMdJB-zWoOoSImP0JKBSjXKnr6',
        rightRow: 'http://store-pic.medmeeting.com/Fs-xKr7Osuai-iDbn3IUb9pRn_5E',
        invalide: 2
      }
    },
    onLoad () {
      this.invalide = 2
      if (this.$store.state.token) {
        this.invalide = 1
        this.setPersonalInfo()
      } else {
        this.invalide = 0
      }
    },
    methods: {
      toCollect () {
        this.jumpPage(`/pages/collection/main`)
      },
      toOrder () {
        this.jumpPage(`/pages/order/main`)
      },
      toPacket () {
        this.jumpPage(`/pages/packet/main`)
      },
      logout () {
        wx.showModal({
          title: '提示',
          content: '确认退出吗？',
          success: (res) => {
            if (res.confirm) {
              this.$store.commit('SET_USERINFO', '')
              this.$store.commit('SET_TOKEN', '')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      ...mapActions([
        'setPersonalInfo'
      ])
    },
    watch: {
      login (v) {
        if (v) {
          this.setPersonalInfo()
          this.invalide = 1
        } else {
          this.invalide = 0
        }
      }
    },
    computed: {
      login () {
        return this.$store.state.token
      },
      userInfo () {
        return this.$store.state.personalInfo || {}
      }
    }
  }
</script>
<style lang="less">
  .user-header-container {
    flex: none;
    position: relative;
    display: flex;
    height: 308rpx;
    box-sizing: border-box;
    padding: 100rpx 16rpx 64rpx 60rpx;
    background: url("http://store-pic.medmeeting.com/FonIHRN4KdTTfKWH4WfEdz8Bx_ih") no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    .avatar-container {
      position: relative;
      top: -18rpx;
      width: 130rpx;
      height: 130rpx;
      margin-right: 30rpx;
      border-radius: 50%;
      flex: none;
      background-color: skyblue;
      .avatar {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
      }
    }
    .user-info {
      flex: 1;
      .phone {
        font-size: 28rpx;
      }
      .department {
        font-size: 32rpx;
      }
    }
    .text{
      font-size: 14px;
      text-align: center;
    }
    .code-container {
      flex: none;
      font-size: 12px;
      line-height: 2.4;
      margin-top: 4px;
      .qrcode {
        display: block;
        margin: 0 auto;
      }
    }
    .edit {
      position: absolute;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      width: 40px;
      right: 4px;
      top: 0;
    }
  }
  .med-user-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .nav{
      background: #fff;
      line-height: 40rpx;
      padding-top: 40rpx;
      .vux-x-icon-ios-arrow-right{
        fill: #C7C7C7;
        width: 50rpx;
      }
      .item{
        padding: 44rpx 0;
        display: flex;
        justify-content: space-between;
        .right-row-icon{
          margin-right: 56rpx;
          img{
            width: 15rpx;
            height: 26rpx;
          }
        }
        span{
          margin-left: 56rpx;
          img{
            width: 44rpx;
            height: 51rpx;
            margin-right: 36rpx;
            vertical-align: middle;
          }
        }
        img{
          vertical-align: middle
        }
      }
    }
  }
  .logout-btn{
    position: absolute;
    bottom: 120rpx;
    width: 600rpx;
    left: 50%;
    margin-left: -300rpx;
    .grad-btn{
      background: linear-gradient(90deg, rgb(29, 98, 240), rgb(25, 213, 253));
      color: #fff;
      border-radius: 100px;
      border: none;
    }
  }
</style>
