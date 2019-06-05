# vue-ios-roller-picker

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## install
```
npm install vue-ios-roller-picker

```

## example
```
import vueIosRollerPicker from 'vue-ios-roller-picker'

Vue.use(vueIosRollerPicker)

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

```

### rollerPickerBox props
```
  | name       | type       | explain       |
  | ------------- |:-------------:|:-------------:|
  | layer            | Boolean           | Show mask or not. |
  | lineColor           | String          | Sets the color of the selected portion of the border. |
```

### rollerPicker props
```
  | name       | type       | explain       |
  | ------------- |:-------------:|:-------------:|
  | data            | Array           | List of data to be selected. |
  | index           | Number          | Currently selected index. |
  | options           | Object          | Other configuration. |
```

### rollerPicker options
```
  | name       | type       | explain       |
  | ------------- |:-------------:|:-------------:|
  | loop            | Boolean           | Turn on the loop scroll. |
  | height           | Number          |  |
  | width           | Number          |  |
  | unitRatio           | Number          | Angle between each option. Such as Math.PI / 8  |
```