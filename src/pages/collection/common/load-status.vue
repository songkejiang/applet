<template>
  <div class="load-more" v-show="showLoadMore">{{loadText}}</div>
</template>
<script>
  export default {
    data() {
      return {
        loadText: '正在加载...',
      }
    }
  }
</script>
<style lang="less"></style>
