import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from "./routes";

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }else{
      if (to.hash) {
        return {
          selector: to.hash
        }
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
})

export default router
