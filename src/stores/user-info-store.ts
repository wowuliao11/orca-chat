import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    id: '',
    username: '',
    roles: [] as string[],
    email: '',
    avatar: '',
    nick: '',
    token: LocalStorage.getItem('O-TOKEN'),
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
      token,
    }: {
      id: string;
      username: string;
      roles: Array<string>;
      email: string;
      avatar: string;
      nick: string;
      token?: string;
    }) {
      this.id = id;
      this.username = username;
      this.roles = roles;
      this.email = email;
      this.avatar = avatar;
      this.nick = nick;
      if (token) this.token = token;
    },
    logOut() {
      this.id = '';
      this.username = '';
      this.roles = [];
      this.email = '';
      this.avatar = '';
      this.nick = '';
      this.token = '';
    },
  },
});
