<template>
  <router-view />
</template>

<script setup lang="ts">
import { socket } from 'boot/socketio';
import { userInfoStore } from 'stores/user-info-store';
import { watch } from 'vue';

const userInfo = userInfoStore();

console.log('here');

// Watch userInfo change and reset io token
watch(userInfo, (value) => {
  console.log('CHANGE:' + value.token);
  console.log(socket.auth);
  const auth = socket.auth as any;
  console.log('compare', value.token, ' : ', auth.Authorization);
  if (value.token !== auth.Authorization) {
    socket.auth = { Authorization: value.token };
    socket.disconnect();
    socket.connect();
  }
});
</script>
