<template>
  <div class="panel">
    <div class="title">
      Date
      <div class="val">
        {{year + '/' + month + '/' + day}}
      </div>
    </div>
    <rollerPickerBox>
      <rollerPicker :data="yearList" :index.sync="yearIndex" @change="onYearChange" :options="{style: {'font-size': '14px'}}"></rollerPicker>
      <rollerPicker :data="monthList" :index.sync="monthIndex" @change="onMonthChange" :options="{style: {'font-size': '14px'}}"></rollerPicker>
      <rollerPicker :data="dayList" :index.sync="dayIndex" @change="onDayChange" :options="{style: {'font-size': '14px'}}"></rollerPicker>
    </rollerPickerBox>
  </div>
</template>

<script>
export default {
  props: {
    initdata: {
      type: String
    }
  },
  data () {
    return {
      yearIndex: 19,
      monthIndex: 0,
      dayIndex: 0
    }
  },
  computed: {
    yearList () {
      const crtYear = new Date().getFullYear()
      const arr = []
      for (let i = crtYear - 100; i < crtYear; i++) {
        arr.unshift({text: i, value: i})
      }
      return arr
    },
    monthList () {
      const arr = []
      for (let i = 1; i <= 12; i++) {
        arr.push({text: i, value: i})
      }
      return arr
    },
    dayList () {
      const d = new Date(this.year, this.month, 0)
      const arr = []
      for (let i = 1; i <= d.getDate(); i++) {
        arr.push({text: i, value: i})
      }
      return arr
    },
    year () {
      return this.yearList[parseInt(this.yearIndex)].value
    },
    month () {
      return this.monthList[parseInt(this.monthIndex)].value
    },
    day () {
      return this.dayList[parseInt(this.dayIndex)].value
    }
  },
  methods: {
    getValue () {
      this.$emit('change', this.year + '/' + this.month + '/' + this.day)
    },
    onYearChange (index) {
      this.yearIndex = index
      this.getValue()
    },
    onMonthChange (index) {
      this.monthIndex = index
      this.getValue()
    },
    onDayChange (index) {
      this.dayIndex = index
      this.getValue()
    }
  },
  mounted () {
    if (this.initdata) {
      const date = new Date(this.initdata)
      if (isNaN(date.getFullYear())) return false
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      for (let i = 0; i < this.yearList.length; i++) {
        const el = this.yearList[i]
        if (el.value === y) {
          this.yearIndex = i
        }
      }
      this.monthIndex = m - 1
      this.dayIndex = d - 1
    }
  }
}
</script>

