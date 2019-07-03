<template>
 <swiper-item >
    <slot></slot>
</swiper-item>
</template>
<script>
export default {
  name: 'pane',
  props: {
    label: {
      type: String,
      default: '标签'
    },
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateNav () {
      this.$parent.updateNav()
    }
  },
  onLoad () {
    this.updateNav()
  }
}
</script>
