<template>
  <router-view />
</template>

<script setup lang="ts">
import { socket } from 'boot/socketio';
import { userInfoStore } from 'stores/user-info-store';
import { watch } from 'vue';

const userInfo = userInfoStore();

// Watch userInfo change and reset io token
watch(userInfo, (value) => {
  const auth = socket.auth as any;
  if (value.token !== auth.Authorization) {
    socket.auth = { Authorization: value.token };
    socket.disconnect();
    socket.connect();
  }
});
</script>
