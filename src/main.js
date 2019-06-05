import Vue from 'vue'
import App from './App.vue'
import vueIosRollerPicker from './components/vueIosRollerPicker'
Vue.use(vueIosRollerPicker);
// Vue.config.productionTip = false;

new Vue({
  el: '#app',
  render: h => h(App)
})
