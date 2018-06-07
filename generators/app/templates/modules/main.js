//引入vue、vue-router和根组件app.vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import oStore from './store';
import routes from './routes';

import app from 'App.vue';
Vue.use(Vuex);
const store = new Vuex.Store(oStore);

Vue.use(VueRouter);
const router = new VueRouter({
  	routes
})


window.huyaVue=new Vue({
	el: '#app',
	router,
	store,
	render: h => h(app)
})



