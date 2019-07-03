<template>
  <tab-switch v-model='a'>
    <pane label='待支付' name='1'>
      <unpay ref='unpay'></unpay>
    </pane>
    <pane label='已购课程' name='2'>
      <pay ref='pay'></pay>
    </pane>
  </tab-switch>
</template>
<script>
  import tabSwitch from '@/components/tabs'
  import pane from '@/components/tabs/pane'
  import unpay from './unpay'
  import pay from './pay'
  export default {
    data () {
      return {
        a: '',
        list: []
      }
    },
    watch: {
      a (v) {
        this.init(v)
      }
    },
    methods: {
      init (v) {
        if (this.list.indexOf(v) === -1) {
          if (v === '1') {
            setTimeout(() => {
              this.$refs.unpay && this.$refs.unpay.getData()
            }, 100)
          }
          if (v === '2') {
            this.$refs.pay && this.$refs.pay.getData()
          }
          this.list.push(v)
          this.list = [...new Set(this.list)]
        }
      }
    },
    onUnload () {
      this.a = ''
      this.list = []
    },
    onLoad () {
      this.a = '1'
      this.$store.commit('loading', true)
    },
    components: {
      tabSwitch,
      pane,
      unpay,
      pay
    }
  }
</script>
<style lang="less" scoped="">
  .tab-content{
    margin-top: 64rpx;
  }
</style>
