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
        :avatar="`https://cdn.quasar.dev/img/avatar${(index % 2) + 1}.jpg`"
        :text="[r.msg]"
        :sent="r.send"
      />
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

const river = ref<Array<{ msg: string; user: any; send: boolean }>>([]);

const message = ref('');

const onSend = async () => {
  await socket.emit('msgToServer', message.value);
};

onMounted(async () => {
  socket.on('msgToClient', async (msg: string) => {
    river.value.push({ send: false, msg, user: {} });
  });
});
</script>
