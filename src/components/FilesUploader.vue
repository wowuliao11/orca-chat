<template>
  <div class="q-pa-md" style="max-width: 300px">
    {{ images }}
    <q-uploader
      :factory="factory"
      label="Custom list"
      multiple
      auto-upload
      @uploaded="onUploaded"
    >
      <template v-slot:list>
        <q-list separator>
          <PhotoSiwiper galleryID="upload" :images="images" />
        </q-list>
      </template>
    </q-uploader>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage, QUploaderFactoryObject } from 'quasar';
import PhotoSiwiper from 'components/PhotoSwiper.vue';
import { ref } from 'vue';

const images = ref<(string | undefined)[]>([]);

const factory = () => {
  return new Promise<QUploaderFactoryObject>((resolve) => {
    // Retrieve JWT token from your store.
    resolve({
      url: process.env.API_BASE_URL + '/cos',
      method: 'POST',
      fieldName: 'file',
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${LocalStorage.getItem('O-TOKEN')}`,
        },
      ],
    });
  });
};
const onUploaded = async ({ xhr }: { xhr: any }) => {
  const result = JSON.parse(xhr.response);
  images.value.push(result?.payload?.file[0]);
};
</script>
