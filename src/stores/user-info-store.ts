import { defineStore } from 'pinia';

export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    id: '',
    username: '',
    roles: [] as string[],
    email: '',
  }),
  getters: {},
  actions: {
    updateInfo({
      id,
      username,
      roles,
      email,
    }: {
      id: string;
      username: string;
      roles: Array<string>;
      email: string;
    }) {
      this.id = id;
      this.username = username;
      this.roles = roles;
      this.email = email;
    },
    logOut() {
      this.id = '';
      this.username = '';
      this.roles = [];
      this.email = '';
    },
  },
});
