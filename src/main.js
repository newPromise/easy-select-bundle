import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import { Checkbox } from 'element-ui'
import App from './App.vue'

// Vue.use(Checkbox)

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
