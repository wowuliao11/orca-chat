import { LocalStorage } from 'quasar';
import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4444', {
  extraHeaders: { Authorization: 'Bearer ' + LocalStorage.getItem('O-TOKEN')! },
});

export default boot(async (/* { app, router, ... } */) => {
  // client-side
  socket.on('connect', () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on('disconnect', () => {
    console.log(socket.id); // undefined
  });
});

export { socket };
