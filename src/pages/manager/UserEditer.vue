<template>
  <q-page class="main-bg row items-center justify-evenly">
    <q-list bordered class="rounded-borders col-12" style="max-width: 1000px">
      <q-item-label header>Edit profile</q-item-label>

      <q-separator spaced />

      <!-- avatar -->
      <q-item>
        <q-item-section avatar top>
          <q-icon name="las la-fish" color="black" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">Avatar</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-item-label lines="1">
            <files-uploader
              v-model="formData.avatar"
              :images="[userInfo.avatar || globalConfig.defaultAvatarUrl]"
              :maxFiles="1"
            />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- nickname -->
      <q-item>
        <q-item-section avatar top>
          <q-icon name="las la-signature" color="black" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">Nickname</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-input v-model="formData.nick" item-aligned></q-input>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item>
        <q-btn @click="onSubmit">Submit Change</q-btn>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts" setup>
import FilesUploader from 'components/FilesUploader.vue';
import { userInfoStore } from 'stores/user-info-store';
import { globalConfigStore } from 'stores/global-config-store';
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
const userInfo = userInfoStore();
const globalConfig = globalConfigStore();

const $q = useQuasar();

const formData = ref({ avatar: '', nick: userInfo.nick });

const onSubmit = async () => {
  const { nick, avatar } = formData.value;
  const result = await api.patch('/user/editProfile', {
    avatar: avatar[0],
    nick,
  });

  result.data.payload;
  userInfo.updateInfo({ ...result.data.payload, id: result.data.payload?._id });

  $q.notify({ type: 'positive', message: 'Modify successfully!' });
};
</script>
