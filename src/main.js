import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import VueGtag from "vue-gtag";
import VueRouter from 'vue-router';
import App from './App.vue';
import './icons.js';
import AboutPage from "./views/AboutPage.vue";
import SearchPage from "./views/SearchPage.vue";

Vue.use(VueGtag, { config: { id: "UA-156077638-1" } })
Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.config.productionTip = false
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

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
