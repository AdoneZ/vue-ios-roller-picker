<template>
  <div class="panel">
    <div class="title">
      Time
      <div class="val">
        {{time}}
      </div>
    </div>
    <rollerPickerBox>
      <rollerPicker :data="hours" :index="hourIndex" @change="onHourChange" :options="{loop:true}"></rollerPicker>
      <rollerPicker :data="minutes" :index="minuteIndex" @change="onMinuteChange" :options="{loop:true}"></rollerPicker>
    </rollerPickerBox>
  </div>
</template>

<script>
const getDoubleBitNumber = (n) => {
  return n < 10 ? '0' + n : (n + '')
}
export default {
  data () {
    return {
      hourIndex: 0,
      minuteIndex: 0
    }
  },
  computed:{
    hours () {
      const arr = []
      for (let i = 0; i <= 23; i++) {
        arr.push({value: i, text: getDoubleBitNumber(i)})
      }
      return arr
    },
    minutes () {
      const arr = []
      for (let i = 0; i <= 59; i++) {
        arr.push({value: i, text: getDoubleBitNumber(i)})
      }
      return arr
    },
    time () {
      return this.hours[this.hourIndex].text + ':' + this.minutes[this.minuteIndex].text
    }
  },
  methods: {
    onHourChange (index) {
      this.hourIndex = index
    },
    onMinuteChange (index) {
      this.minuteIndex = index
    }
  }
}
</script>

