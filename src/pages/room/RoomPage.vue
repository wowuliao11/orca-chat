<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>ROOM TITLE</q-item-label>
        <q-item-label caption> haha </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section>
      <!-- chat content -->

      <q-chat-message
        v-for="(r, index) in river"
        :key="index"
        :name="r.user?.name || 'unknowName'"
        :avatar="r.user.avatar"
        :sent="r.send"
        :text="r.msg"
      >
      </q-chat-message>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="message"
        label="I WANT TO SAY!!"
        @keydown.enter.prevent="onSend"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { socket } from 'boot/socketio';
import { userInfoStore } from 'stores/user-info-store';

const river = ref<
  Array<{ msg: string[]; user: any; send: boolean; failure: boolean }>
>([]);

const userInfo = userInfoStore();

const message = ref('');

const onSend = async () => {
  const tmpMsg = message.value;

  socket.emit('msgToServer', { message: tmpMsg }, (val: any) => {
    console.log(val);
    const lastElement = river.value[river.value.length - 1];

    if (lastElement && lastElement.user?.id === userInfo.id)
      lastElement.msg?.push(tmpMsg);
    else
      river.value.push({
        send: true,
        msg: [val.message],
        user: {
          id: userInfo.id,
          name: userInfo.username,
          avatar: userInfo.avatar,
        },
        failure: false,
      });
    message.value = '';
  });
};

onMounted(async () => {
  socket.on('msgToClient', async (data: any) => {
    if (userInfo.id !== data.user?._id) {
      const lastElement = river.value[river.value.length - 1];
      if (lastElement && lastElement.user?.id === data.user?._id)
        lastElement.msg?.push(data.message);
      else
        river.value.push({
          send: false,
          msg: [data.message],
          user: {
            id: data.user?._id,
            name: data.user?.username,
            avatar: data.user?.avatar,
          },
          failure: false,
        });
    }
  });
});
</script>
