import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faQuestionCircle,
  faPeopleCarry,
  faUsers,
  faShuttleVan,
  faLocationArrow,
  faArrowLeft,
  faArrowRight,
  faTint,
  faHeart,
  faFireAlt,
  faListUl,
  faMap,
  faBars,
  faExternalLinkAlt,
  faPhoneSquareAlt,
  faEnvelopeSquare,
  faDirections,
  faAddressCard
} from '@fortawesome/free-solid-svg-icons'
import {
  faUsdCircle,
  faHomeHeart,
  faBedEmpty,
  faPawAlt,
  faBoxHeart,
  faHandHeart,
  faCars,
  faArrowToRight
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueGtag from "vue-gtag";
import VueRouter from 'vue-router'

Vue.use(VueGtag, {config: { id: "UA-156077638-1" }})
Vue.use(VueRouter)
Vue.use(BootstrapVue)

library.add(faQuestionCircle)
library.add(faUsdCircle)
library.add(faHomeHeart)
library.add(faBedEmpty)
library.add(faPawAlt)
library.add(faBoxHeart)
library.add(faPeopleCarry)
library.add(faUsers)
library.add(faHandHeart)
library.add(faHeart)
library.add(faCars)
library.add(faShuttleVan)
library.add(faArrowToRight)
library.add(faLocationArrow)
library.add(faArrowLeft)
library.add(faArrowRight)
library.add(faTint)
library.add(faFireAlt)
library.add(faListUl)
library.add(faMap)
library.add(faBars)
library.add(faExternalLinkAlt)
library.add(faPhoneSquareAlt)
library.add(faEnvelopeSquare)
library.add(faDirections)
library.add(faAddressCard)

Vue.config.productionTip = false
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
