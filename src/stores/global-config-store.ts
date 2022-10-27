import { defineStore } from 'pinia';

export const globalConfigStore = defineStore('globalConfig', {
  state: () => ({
    defaultAvatarUrl: 'http://49.234.100.96:9000/orca-chat/1666857751124.png',
  }),
  getters: {},
  actions: {},
});
