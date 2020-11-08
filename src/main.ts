import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import BootstrapVue from 'bootstrap-vue';
import VueMoment from 'vue-moment';
import VueGeolocation from 'vue-browser-geolocation';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueMoment);
Vue.use(VueGeolocation);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
