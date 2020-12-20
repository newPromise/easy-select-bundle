import Vue from 'vue'
import { Checkbox, Button, Autocomplete } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Autocomplete)


new Vue({
  render: h => h(App),
}).$mount('#app')
