import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        name: 'LOGIN',
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'HOME',
        path: 'home',
        component: () => import('pages/IndexPage.vue'),
        alias: ['/', '/home'],
      },
      { path: 'room', component: () => import('pages/room/RoomPage.vue') },
      {
        path: '/editUser',
        component: () => import('pages/manager/UserEditer.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
