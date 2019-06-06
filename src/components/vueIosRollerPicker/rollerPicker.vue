<template>
  <div class="roller-picker" :style="pickerStyle" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @touchcancel="touchend">
    <div class="roller-picker-item" v-for="(item,index) in data" :key="index" :style="crtListStyle[index]">
      {{item.text}}
    </div>
  </div>
</template>
<script>
import ani from './ani.js'
export default {
  name: 'rollerPicker',
  props: {
    options: {
      type: Object
    },
    data: {
      type: [Array, Object],
      required: true
    },
    index: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      scrollHeight: 0,
      touchstartY: null,
      oldScrollHeight: 0,
      aniId: null,
      scrollPrevTime: 0,
      scrollPrevY: 0,
      scrollEndSpeed: 0
    }
  },
  computed: {
    pickerOptions () {
      const options = {
        height: 150,
        unitRatio: Math.PI / 8,
        loop: false,
        width: 80,
        style: {}
      }
      
      if (this.options) {
        Object.keys(this.options).forEach(k => {
          switch (k) {
            case 'style':
              for (let k in this.options.style) {
                options.style[k] = this.options.style[k]
              }
              break
            default:
              options[k] = this.options[k]
          }
        })
      }
      options.radius = options.height * 0.45
      options.pixelRatio = 2 * Math.PI * options.radius
      options.unitDistence = options.pixelRatio / 16
      options.totalHeight = options.unitDistence * (Object.keys(this.listPosition).length - 1)
      options.style.width = options.width + 'px'
      options.style.height = options.height + 'px'
      return options
    },
    pickerStyle () {
      return this.pickerOptions.style
    },
    listPosition () {
      const list = {}
      if (this.data.length !== undefined) {
        this.data.forEach((el, index) => {
          list[index] = {index}
        })
      } else {
        let index = 0
        Object.keys(this.data).forEach(key => {
          list[key] = {index}
          index++
        })
      }
      return list
    },
    crtListStyle () {
      const list = {}
      const keyList = Object.keys(this.listPosition)
      const keyListLength = keyList.length
      keyList.forEach((key, index) => {
        const el = this.listPosition[key]
        let sh = this.scrollHeight
        if (this.pickerOptions.loop) {
          if (this.scrollHeight > -this.pickerOptions.pixelRatio * 0.25 && index > (keyListLength - 10)) {
            sh = -(this.pickerOptions.totalHeight + this.pickerOptions.unitDistence - this.scrollHeight)
          } else if (this.scrollHeight < (-this.pickerOptions.totalHeight + this.pickerOptions.pixelRatio * 0.25 + this.pickerOptions.unitDistence) && index < 10) {
            sh = -(-this.pickerOptions.totalHeight - this.pickerOptions.unitDistence - this.scrollHeight)
          }
        }
        const elRatio = el.index * this.pickerOptions.unitRatio + sh / this.pickerOptions.radius
        const elDistence = el.index * this.pickerOptions.unitDistence
        const o = 1 - (elDistence + sh) / (this.pickerOptions.pixelRatio / 4)
        let opacity = o > 1 ? 2 - o : o
        const y = Math.sin(elRatio) * this.pickerOptions.radius
        const z = Math.cos(elRatio) * this.pickerOptions.radius
        const rotateX = -elRatio * 180 / Math.PI
        list[key] = {
          transform: 'translate3D(0,' + y + 'px,' + z + 'px) rotateX(' + rotateX + 'deg)',
          opacity
        }
      })
      return list
    }
  },
  methods: {
    touchstart (e) {
      this.touchstartY = e.touches[0].clientY
      this.oldScrollHeight = this.scrollHeight
      this.scrollPrevTime = new Date().getTime() * 0.001
      this.scrollPrevY = this.touchstartY
      this.scrollEndSpeed = 0
      if (this.aniId) {
        ani.stop(this.aniId)
        this.aniId = null
      }
      e.preventDefault()
    },
    touchmove (e) {
      const y = e.touches[0].clientY
      const d = y - this.touchstartY
      const result = this.setScrollHeight(this.oldScrollHeight + d)
      if (result === 1) {
        this.oldScrollHeight = this.scrollHeight
        this.touchstartY = y
      }
      this.recordScroll(y)
      e.preventDefault()
    },
    touchend (e) {
      if (this.aniId) {
        ani.stop(this.aniId)
        this.aniId = null
      }
      const pm = this.scrollEndSpeed >= 0 ? 1 : -1
      const a = 50
      let time = Math.abs(this.scrollEndSpeed) * 1000 / a
      const t = time * 0.001
      let d = this.scrollEndSpeed * t - a * Math.pow(t, 2) * pm / 2
      const yd = (d + this.scrollHeight) % this.pickerOptions.unitDistence
      const halfUnitDistence = this.pickerOptions.unitDistence / 2
      if (yd > 0) {
        if (yd > halfUnitDistence) d += this.pickerOptions.unitDistence - yd
        else d -= yd
      } else {
        if (yd < -halfUnitDistence) d += -this.pickerOptions.unitDistence - yd
        else d -= yd
      }
      if (time < 300) time = 300
      if (time > 3000) time = 3000
      let oldSit = this.scrollHeight
      let oldP = 0
      this.aniId = ani.start((p) => {
        const goon = this.setScrollHeight(oldSit + d * (p - oldP))
        if (goon === 1) {
          oldSit = this.scrollHeight
          oldP = p
        }
        if (!this.pickerOptions.loop && !goon) {
          ani.stop(this.aniId)
          this.aniId = null
          const goldDistence = this.scrollHeight
          let selectIndex = Math.round((Math.abs(goldDistence) % (this.pickerOptions.totalHeight + this.pickerOptions.unitDistence)) / this.pickerOptions.unitDistence)
          selectIndex = selectIndex >= this.listPosition.length ? selectIndex - 1 : selectIndex
          this.$emit('change', selectIndex)
        }
        if (p === 1) {
          const goldDistence = this.scrollHeight
          let selectIndex = Math.round((Math.abs(goldDistence) % (this.pickerOptions.totalHeight + this.pickerOptions.unitDistence)) / this.pickerOptions.unitDistence)
          selectIndex = selectIndex >= this.listPosition.length ? selectIndex - 1 : selectIndex
          this.$emit('change', selectIndex)
        }
      }, null, 'quadOut', time)
      e.preventDefault()
    },
    setScrollHeight (val) {
      if (this.pickerOptions.loop) {
        if (val > 0) {
          this.scrollHeight = -this.pickerOptions.totalHeight - this.pickerOptions.unitDistence + val
          return 1
        } else if (val < -this.pickerOptions.totalHeight - this.pickerOptions.unitDistence) {
          this.scrollHeight = -Math.abs(val) + Math.abs(-this.pickerOptions.totalHeight - this.pickerOptions.unitDistence)
          return 1
        }
      } else {
        if (val > 0) {
          this.scrollHeight = 0
          return false
        } else if (val < -this.pickerOptions.totalHeight) {
          this.scrollHeight = -this.pickerOptions.totalHeight
          return false
        }
      }
      this.scrollHeight = val
      return true
    },
    recordScroll (y) {
      const endTime = new Date().getTime() * 0.001
      if (endTime - this.scrollPrevTime < 0.001) return
      this.scrollEndSpeed = (y - this.scrollPrevY) * 0.1 / (endTime - this.scrollPrevTime)
      this.scrollPrevTime = endTime
      this.scrollPrevY = y
    },
    setSitByIndex () {
      this.setScrollHeight(-this.index * this.pickerOptions.unitDistence)
    }
  },
  mounted () {
    this.setSitByIndex()
  },
  watch: {
    index (val, old) {
      const v = isNaN(val) ? 0 : val
      if (this.data.length) {
        this.scrollHeight = -this.pickerOptions.unitDistence * v
      } else {
        const index = Object.keys(this.data).indexOf(val)
        this.scrollHeight = -this.pickerOptions.unitDistence * index
      }
    },
    data (val, old) {
      this.scrollHeight = 0
      this.$emit('change', 0)
    }
  }
}
</script>
<style lang="stylus" scoped>
.roller-picker
  position relative
  font-size 18px
  text-align center
.roller-picker-item
  position absolute
  height 30px
  line-height @height
  top calc(50% - 15px)
  width 100%
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>
