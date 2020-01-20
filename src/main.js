import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueGtag from "vue-gtag";
import VueRouter from 'vue-router'
import './icons.js'

Vue.use(VueGtag, {config: { id: "UA-156077638-1" }})
Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.config.productionTip = false
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import SearchPage from "./views/SearchPage.vue";
import AboutPage from "./views/AboutPage.vue";

const router = new VueRouter({
    routes: [
      { path: '/', component: SearchPage },
      { path: '/about', component: AboutPage },
    ]
  })

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
