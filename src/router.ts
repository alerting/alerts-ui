import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Active from './views/Active.vue';
import Alert from './views/Alert.vue';
import ActiveAlerts from './views/ActiveAlerts.vue';
import ForYou from './views/ForYou.vue';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to: any, from: any, savedPosition: any): any {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/for-you',
      name: 'for-you',
      component: ForYou,
    },
    {
      path: '/active',
      name: 'active',
      component: Active,
      children: [
        {
          path: '/active/canada',
          name: 'active-canada',
          component: ActiveAlerts,
          meta: {
            system: 'naads',
          },
        },
        {
          path: '/active/united-states',
          name: 'active-us',
          component: ActiveAlerts,
          meta: {
            system: 'nws',
          },
        },
      ],
    },
    {
      path: '/alerts/:id',
      name: 'alert',
      component: Alert,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === 'home' || to.name == 'active') {
    next({ path: '/for-you', replace: true });
    return;
  }

  next();
});

export default router;
