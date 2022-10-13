import { defineStore } from 'pinia';

export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    id: '',
    username: '',
    roles: [] as string[],
  }),
  getters: {},
  actions: {
    updateInfo({
      id,
      username,
      roles,
    }: {
      id: string;
      username: string;
      roles: Array<string>;
    }) {
      this.id = id;
      this.username = username;
      this.roles = roles;
    },
    logOut() {
      this.id = '';
      this.username = '';
      this.roles = [];
    },
  },
});
