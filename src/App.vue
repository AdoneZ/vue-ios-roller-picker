<template>
  <div id="app">
    <div class="title">Vue iOS Roller Picker Demo</div>
    <DatePicker></DatePicker>
    <TimePicker></TimePicker>
  </div>
</template>

<script>
import DatePicker from './example/DatePicker'
import TimePicker from './example/TimePicker'
export default {
  name: 'app',
  components: {DatePicker, TimePicker},
  data () {
    return {
    }
  }
}
</script>
<style lang="stylus">
body
  padding 0
  margin 0
.title
  font-size 20px
  padding 10px
  .val
    font-size 14px
</style>

