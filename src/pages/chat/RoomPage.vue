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
            :stamp="r.time"
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
import { ref } from 'vue';
import { socket } from 'boot/socketio';
import { userInfoStore } from 'stores/user-info-store';
import { api } from 'src/boot/axios';
import { date, useQuasar } from 'quasar';

const MSG_TO_CLINET = 'MSG_TO_CLINET';
const MSG_TO_SERVER = 'MSG_TO_SERVER';
const ERROR_FLAG = 'ERROR';
const JOIN_FLAG = 'JOIN';

const $q = useQuasar();

const route = useRoute();
const { roomId: roomKey } = route.params;

const userRoomPermission = ref(false);

const river = ref<
  Array<{
    msg: string[];
    user: any;
    send: boolean;
    failure: boolean;
    time?: string;
  }>
>([]);

const userInfo = userInfoStore();

const roomRef = ref({
  avatar: '',
  title: roomKey,
  describe: 'No describe',
  id: '',
});

const message = ref('');

const load = async () => {
  // Check user role into the room
  const result = await api.get('/room/checkIsUserInRoom', {
    params: { roomTitle: roomKey },
  });
  if (result.data?.payload) userRoomPermission.value = true;
  else return;

  // Get this room instance
  const {
    data: { payload: room },
  } = await api.get('/room/findOne', {
    params: { key: roomKey },
  });

  // Initialize chatting history
  const {
    data: { payload: histories },
  } = await api.get('/history/room', { params: { roomId: room._id } });
  for (const history of histories) {
    if (userInfo.id !== history.from?._id) {
      const lastElement = river.value[river.value.length - 1];

      if (lastElement && lastElement.user?.id === history.from?._id)
        lastElement.msg?.push(history.content);
      else
        river.value.push({
          send: false,
          msg: [history.content],
          user: {
            id: history.from?._id,
            name: history.from?.username,
            avatar: history.from?.avatar,
          },
          time: date.formatDate(history.createdAt, 'YYYY-MM-DD HH:mm:ss'),
          failure: false,
        });
    } else {
      const lastElement = river.value[river.value.length - 1];

      if (lastElement && lastElement.user?.id === history.from?._id)
        lastElement.msg?.push(history.content);
      else
        river.value.push({
          send: true,
          msg: [history.content],
          user: {
            id: history.from?._id,
            name: history.from?.username,
            avatar: history.from?.avatar,
          },
          time: date.formatDate(history.createdAt, 'YYYY-MM-DD HH:mm:ss'),
          failure: false,
        });
    }
  }

  socket.emit(JOIN_FLAG, { roomId: room._id });

  roomRef.value = {
    avatar: room.avatar,
    title: room.title,
    describe: room.describe,
    id: room._id,
  };
};
/***
 * Send message to server
 */
const onSend = async () => {
  const tmpMsg = message.value;

  socket.emit(
    MSG_TO_SERVER,
    { message: tmpMsg, room: roomRef.value.id },
    (val: any) => {
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
            name: userInfo.nick,
            avatar: userInfo.avatar,
          },
          time: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          failure: false,
        });
      message.value = '';
    }
  );
};

socket.on(MSG_TO_CLINET, async (data: any) => {
  console.log(userInfo.id, data.user?._id);
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
        time: date.formatDate(data.time, 'YYYY-MM-DD HH:mm:ss'),
        failure: false,
      });
  }
});

socket.on(ERROR_FLAG, (data) => {
  $q.notify({ type: 'negative', message: data.message });
});

load();
</script>
