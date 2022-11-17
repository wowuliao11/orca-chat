<template>
  <div class="q-pa-md justify-center items-center row">
    <div class="col-lg-7 justify-center">
      <q-card flat bordered v-if="userRoomPermission">
        <q-item>
          <q-item-section avatar>
            <q-avatar v-if="roomRef.avatar">
              <img :src="roomRef.avatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ roomRef.title }}</q-item-label>
            <q-item-label caption> {{ roomRef.describe }} </q-item-label>
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
            bg-color="primary"
            text-color="white"
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
      <q-card class="my-card" flat bordered v-else>
        <q-card-section>
          You have no permission into the room or not found this room!
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { socket } from 'boot/socketio';
import { userInfoStore } from 'stores/user-info-store';
import { api } from 'src/boot/axios';

const route = useRoute();
const { roomId } = route.params;

const userRoomPermission = ref(false);

const river = ref<
  Array<{ msg: string[]; user: any; send: boolean; failure: boolean }>
>([]);

const userInfo = userInfoStore();

const roomRef = ref({ avatar: '', title: roomId, describe: 'No describe' });

const message = ref('');

const load = async () => {
  const result = await api.get('/room/checkIsUserInRoom', {
    params: { roomTitle: roomId },
  });
  if (result.data?.payload) userRoomPermission.value = true;
  else return;

  const {
    data: { payload: room },
  } = await api.get('/room/findOne', {
    params: { key: roomId },
  });

  roomRef.value = {
    avatar: room.avatar,
    title: room.title,
    describe: room.describe,
  };
};

const onSend = async () => {
  const tmpMsg = message.value;

  socket.emit('msgToServer', { message: tmpMsg }, (val: any) => {
    const lastElement = river.value[river.value.length - 1];

    if (lastElement && lastElement.user?.id === userInfo.id)
      lastElement.msg?.push(tmpMsg);
    else
      river.value.push({
        send: true,
        msg: [val.message],
        user: {
          id: userInfo.id,
          name: userInfo.nick,
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

load();
</script>
