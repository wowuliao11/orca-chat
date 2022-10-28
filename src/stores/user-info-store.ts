import { defineStore } from 'pinia';

export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    id: '',
    username: '',
    roles: [] as string[],
    email: '',
    avatar: '',
    nick: '',
  }),
  getters: {},
  actions: {
    updateInfo({
      id,
      username,
      roles,
      email,
      avatar,
      nick,
    }: {
      id: string;
      username: string;
      roles: Array<string>;
      email: string;
      avatar: string;
      nick: string;
    }) {
      this.id = id;
      this.username = username;
      this.roles = roles;
      this.email = email;
      this.avatar = avatar;
      this.nick = nick;
    },
    logOut() {
      this.id = '';
      this.username = '';
      this.roles = [];
      this.email = '';
      this.avatar = '';
      this.nick = '';
    },
  },
});
