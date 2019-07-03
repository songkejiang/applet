<template>
  <div>
    <web-view :src="url"></web-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        url: ''
      }
    },
    async onLoad (options) {
      console.log(options)
      this.url = options.url
    }
  }
</script>
