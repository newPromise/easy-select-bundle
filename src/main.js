import Vue from 'vue'
import { Checkbox, Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.use(Checkbox)
Vue.use(Button)


new Vue({
  render: h => h(App),
}).$mount('#app')
