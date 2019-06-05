<template>
  <div class="roller-picker-box">
    <div class="roller-picker-box-content">
      <slot></slot>
    </div>
    <div class="roller-picker-box-layer-top" v-if="layer"></div>
    <div class="roller-picker-box-layer-bottom" v-if="layer"></div>
    <div class="roller-picker-box-select" :style="selectLineStyle"></div>
  </div>
</template>
<script>
export default {
  name: 'rollerPickerBox',
  props: {
    layer: {
      type: Boolean,
      default: true
    },
    lineColor: {
      type: String,
      default: 'rgba(0,0,0,0.1)'
    }
  },
  computed:{
    selectLineStyle(){
      return {
        borderColor: this.lineColor
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.roller-picker-box
  width 100%
  position relative
  .roller-picker-box-content
    width 100%
    overflow hidden
    display flex
    justify-content center
    align-items center
    align-content center
    text-align center
    perspective 700px
    position relative
    padding 15px 0
    z-index 1
  .roller-picker-box-select
    border-top 1px solid rgba(255,255,255,0.1)
    border-bottom 1px solid rgba(255,255,255,0.1)
    box-sizing border-box
    height 32px
    position absolute
    width 100%
    top calc(50% - 16px)
    pointer-events none
    z-index 2
.roller-picker-box-layer-top,
.roller-picker-box-layer-bottom
  position absolute
  width 100%
  left 0
  background rgba(0,0,0,0.2)
  z-index 1
  pointer-events none
  height calc(50% - 15px)
.roller-picker-box-layer-top
  top 0
.roller-picker-box-layer-bottom
  bottom 0
</style>
