<template>
    <div class="discount" v-if="info.isDiscount&&remaintime>0&&info.chargeType==='yes'&&!(info.payFlag || info.payFalg)">
      <div class="left">
        <div class="newprice">
          ¥{{info.discountPrice}}
        </div>
        <div class="">
          <div class="text">限时优惠</div>
          <div class="oldprice">
            ¥{{info.price}}
          </div>
        </div>
      </div>
      <div class="right">
        距结束时间<span class="num">{{day}}</span>天<span class="num">{{h}}</span>小时<span class="num">{{m}}</span>分
      </div>
    </div>
</template>
<script>
export default {
  props: {
    info: Object
  },
  watch: {
    'info.isDiscount': {
      handler (v) {
        if (v === true) {
          this.countDown()
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      remaintime: 0,
      day: '',
      h: '',
      m: '',
      s: ''
    }
  },
  methods: {
    countDown () {
      var _this = this
      var t = this.info.discountEndTime - Date.now() // 时间差
      this.remaintime = t
      var d = 0
      var h = 0
      var m = 0
      var s = 0
      function count (t) {
        if (t >= 0) {
          d = Math.floor(t / 1000 / 3600 / 24)
          h = Math.floor((t / 1000 / 60 / 60) % 24)
          m = Math.floor((t / 1000 / 60) % 60)
          s = Math.floor((t / 1000) % 60)
        } else {
          clearInterval(_this.timer)
        }
        _this.day = d
        _this.h = h >= 10 ? h : '0' + h
        _this.m = m >= 10 ? m : '0' + m
        _this.s = s >= 10 ? s : '0' + s
      }
      count(t)
      this.timer = setInterval(() => {
        t -= 60000
        this.remaintime = t
        count(t)
      }, 60000)
    }
  }
}
</script>
<style scoped lang='less'>
.discount{
  height: 110px;
  background-image: url(http://store-pic.medmeeting.com/FmFhPXJhh1z0LZ1zS0I5851i2b3c);
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left{
    display: flex;
    .newprice{
      font-size: 50px;
      display: flex;
      align-items: center;
      margin-left: 30px;
      margin-right: 30px;
    }
    .text{
      font-size: 22px;
      background: #fff;
      padding: 4px;
      border-radius: 5px;
      line-height: 1em;
      color: #0078ff;
      margin-top: 10px;
    }
    .oldprice{
      text-decoration: line-through;
      font-size: 28px;
    }
  }
  .right {
    font-size: 26px;
    color: #333;
    padding-right: 10px;
    .num{
      padding: 4px 6px;
      margin: 0 4px;
      min-width: 32px;
      display: inline-block;
      text-align: center;
      border-radius: 10px;
      background: #62ADFF;
      color: #fff;
    }
  }
}
</style>
