import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import VueFirestore from 'vue-firestore';
import App from './App.vue'

import InicioSinRegistrar from "./components/InicioSinRegistrar.vue";
import Registro from "./components/Registro.vue";
import Login from "./components/Login.vue";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter);
Vue.use(VueFirestore);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: InicioSinRegistrar },
    { path: '/registro', component: Registro },
    { path: '/login', component: Login }
  ]
});

var firebaseConfig = {
  apiKey: "AIzaSyAnqQfQ5Ore-IDmHgIgHcrXSI7ou3s4MHA",
  authDomain: "mitfg-12618.firebaseapp.com",
  projectId: "mitfg-12618",
  storageBucket: "mitfg-12618.appspot.com",
  messagingSenderId: "273477855605",
  appId: "1:273477855605:web:2e5d9965f327837d574b3c"
};

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')