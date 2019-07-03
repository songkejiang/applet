<template>
  <div v-show="!loading">
      <course  :oneLabelId='oneLabelId' :secondLabelId='secondLabelId' :currentId='oneLabelId'/>
      <video-list ref='excellentVideo'  :oneLabelId='oneLabelId' :secondLabelId='secondLabelId' :currentId='oneLabelId'/>
  </div>
</template>
<script>
import course from './course'
import videoList from './video-list'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loading'])
  },
  components: {
    course,
    videoList
  },
  props: {
    oneLabelId: {
      default: -1,
      type: Number
    },
    secondLabelId: {
      default: -1,
      type: Number
    },
    currentId: {
      default: -1,
      type: Number
    }
  },
  methods: {
    loadMore (fresh) {
      this.$refs.excellentVideo.loadMore(fresh)
    }
  }
}
</script>
