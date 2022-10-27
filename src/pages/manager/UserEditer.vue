<template>
  <q-page class="main-bg row items-center justify-evenly">
    <files-uploader
      v-model="formData.avatar"
      :images="[usreInfo.avatar || globalConfig.defaultAvatarUrl]"
      :maxFiles="1"
    />
  </q-page>
</template>

<script lang="ts" setup>
import FilesUploader from 'components/FilesUploader.vue';
import { userInfoStore } from 'stores/user-info-store';
import { globalConfigStore } from 'stores/global-config-store';
import { ref } from 'vue';
const usreInfo = userInfoStore();
const globalConfig = globalConfigStore();

const formData = ref({ avatar: '' });
</script>
