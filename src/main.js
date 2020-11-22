import Vue from 'vue'
import { Checkbox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(Checkbox)


new Vue({
  render: h => h(App),
}).$mount('#app')
