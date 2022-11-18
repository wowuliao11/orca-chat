import { LocalStorage } from 'quasar';
import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4444', {
  auth: {
    Authorization: LocalStorage.getItem('O-TOKEN')?.toString() || '',
  },
});

export default boot(async ({}) => {
  // client-side
  socket.on('connect', () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on('disconnect', () => {
    console.log(socket.id); // undefined
  });
});

export { socket };
