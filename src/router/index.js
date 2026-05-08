import { createRouter, createWebHashHistory } from 'vue-router'

import home from '../pages/home.vue'
import Agencies from '../pages/Agencies.vue'
import Pricing from '../pages/Pricing.vue'
import Fleet from '../pages/Fleet.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
  { path: '/',          name: 'Home',     component: home     },
  { path: '/agencies',  name: 'Agencies', component: Agencies },
  { path: '/pricing',   name: 'Pricing',  component: Pricing  },
  { path: '/fleet',     name: 'Fleet',    component: Fleet    },
    { path: '/login',   name: 'Login',    component: Login },
  { path: '/register',name: 'Register', component: Register }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router