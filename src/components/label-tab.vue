<template>
    <div>
      <scroll-view  scroll-x style="width: 100%;background:#fff" :scroll-with-animation="animation" @scroll="onelabelscroll" :scroll-left='newScrollLeft'>
        <div class="oneLabelWrap"  :id="'oneLabelWrap'+uid">
            <div class="label_item"  :id="'oneLabel'+uid+index" @click='handleClick(label, $event, index)' v-for='(label, index) in labelList' :key='index' :class="{active: oneLabelId == label.id}">
              {{label.labelName}}
            </div>
        </div>
      </scroll-view>
      <scroll-view v-if='secendLabelList.length' scroll-x style="width: 100%;" :scroll-with-animation="animation2" @scroll="secendLabelscroll" :scroll-left='newSecendScrollLeft'>
        <div class="secendLabelWrap" >
            <div class="label_item"  :id="'secendLabel'+uid+index"  @click='handleSecendLabelClick(label, $event)' v-for='(label, index) in secendLabelList' :key='index' :class="{active: secendLabelId == label.id}">
              {{label.labelName}}
            </div>
        </div>
      </scroll-view>
    </div>
  </template>

  <script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        oneLabelId: -1,
        secendLabelId: -1,
        newScrollLeft: 0,
        newSecendScrollLeft: 0,
        uid: new Date().getTime(),
        animation: false,
        animation2: false
      }
    },
    computed: {
      secendLabelList () {
        let arr = []
        this.labelList.forEach(item => {
          if (item.id !== -1 && item.id === this.oneLabelId) {
            arr = [].concat([{id: -1, labelName: '全部'}, ...item.labelList])
          }
        })
        this.newSecendScrollLeft = 0
        this.secendScrollLeft = 0
        return arr
      },
      labelList () {
        return [{id: -1, labelName: this.firstName}, ...this.$store.state.labelList]
      }
    },
    props: {
      selectIndex: [Number, String],
      firstName: {
        default: '推荐',
        type: String
      }
    },
    methods: {
      ...mapActions([
        'getLiveLabel'
      ]),
      handleClick (item, $event, index) {
        this.newScrollLeft = this.scrollLeft
        this.oneLabelId = item.id
        this.secendLabelId = -1
        // this.animation = true
        this.query = wx.createSelectorQuery()
        this.query.select('#' + $event.target.id).boundingClientRect((res) => {
          let targetWidth = res.width
          let datX = targetWidth / 2 + res.left - this.winWidth / 2
          let scrollleft = this.scrollLeft + datX
          if (scrollleft <= 0) {
            scrollleft = 0
          }
          if (scrollleft >= this.maxScrollWidth - 20) {
            scrollleft = this.maxScrollWidth
          }
          this.newScrollLeft = ~~scrollleft
          this.$emit('oneLabelChange', {item, index})
        }).exec()
      },
      onelabelscroll (e) {
        this.maxScrollWidth = e.target.scrollWidth - this.winWidth
        this.animation = false
        this.scrollLeft = e.target.scrollLeft
      },
      handleSecendLabelClick (item, $event) {
        this.animation2 = true
        this.$emit('secondLabelChange', item)
        this.newSecendScrollLeft = this.secendScrollLeft
        this.secendLabelId = item.id
        this.query = wx.createSelectorQuery()
        this.query.select('#' + $event.target.id).boundingClientRect((res) => {
          let targetWidth = res.width
          let datX = targetWidth / 2 + res.left - this.winWidth / 2
          this.newSecendScrollLeft = parseInt(this.secendScrollLeft + datX)
        }).exec()
      },
      secendLabelscroll (e) {
        this.secendScrollLeft = e.target.scrollLeft
        this.animation2 = false
      }
    },
    onLoad () {
      this.winWidth = wx.getSystemInfoSync().windowWidth
      this.scrollLeft = 0
      this.secendScrollLeft = 0
      this.getLiveLabel()
      this.animation = false
      this.animation2 = false
    }
  }
  </script>

  <style lang='less'>
.oneLabelWrap{
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  background: #fff;
  .label_item{
    padding: 10px 30px;
    color: #838899;
    font-size: 30px;
    position: relative;
    border-bottom: 1px solid #ebebeb;
    &.active{
      color: #1c90fe;
      &::after{
        display: inline-block;
        content: '';
        position: absolute;
        width: calc(100% - 40px);
        height: 4px;
        background: #1c90fe;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        border-radius: 10px;
      }
    }
  }
}
.secendLabelWrap {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  padding: 20px 0;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  .label_item{
    background: #ebebeb;
    color: #838899;
    border-radius: 30px;
    font-size: 26px;
    margin: 0 10px;
    padding: 2px 15px;
    &.active{
      color: #fff;
      background: #1c90fe
    }
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
  </style>
