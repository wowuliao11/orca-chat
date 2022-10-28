import { LocalStorage, Notify } from 'quasar';
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { api } from 'boot/axios';
import { userInfoStore } from 'stores/user-info-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({}) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const userStore = userInfoStore();

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to: any) => {
    const token = LocalStorage.getItem('O-TOKEN');

    if (!token && to.name !== 'LOGIN') {
      return { name: 'LOGIN' };
    }

    if (token && !userStore.id) {
      let validFlag = true; // 有效token标识
      const validateData = await api.get('/auth/validate').catch(() => {
        userStore.logOut();
        LocalStorage.clear();
        Notify.create({ type: 'negative', message: 'Authrazation failed!❌' });
        validFlag = false;
      });
      if (!validateData) return { name: 'LOGIN' };
      if (!validFlag) return { name: 'LOGIN' };
      const { username, id, roles, email, avatar, nick } =
        validateData.data?.payload;

      userStore.updateInfo({ username, id, roles, email, avatar, nick });
    }
  });

  return Router;
});
