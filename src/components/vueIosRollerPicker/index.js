import rollerPicker from './rollerPicker.vue'
import rollerPickerBox from './rollerPickerBox.vue'

const components = [
  rollerPicker,
  rollerPickerBox
];
const install = function (Vue) {
  if (install.installed) return
  components.map(component => {
    Vue.component(component.name, component)
  });
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
};
export default{
  install,
  components,
  rollerPicker,
  rollerPickerBox
}