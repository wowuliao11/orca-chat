<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-uploader
      :factory="factory"
      accept="image/*"
      :label="props.label || 'Image Uploader🌞'"
      multiple
      auto-upload
      @uploaded="onUploaded"
      hide-upload-btn
      :readonly="!!(props.maxFiles && images.length >= props.maxFiles)"
    >
      <template v-slot:list>
        <q-list separator>
          <PhotoSiwiper
            galleryID="upload"
            :images="images"
            @file-delete="onFileDelete"
          />
        </q-list>
      </template>
    </q-uploader>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage, QUploaderFactoryObject } from 'quasar';
import PhotoSiwiper from 'src/components/UploaderPhotoSwiper.vue';
import { ref, watch } from 'vue';

const props = defineProps({ images: Array, label: String, maxFiles: Number });

const emit = defineEmits(['update:modelValue']);

const images = ref<any>([...(props.images || [])]);

emit('update:modelValue', props.images);

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

const onFileDelete = async (url: string) => {
  const eIndex = images.value.findIndex((v: string) => v === url);

  images.value.splice(eIndex, 1);
};

watch(images.value, (value) => {
  emit('update:modelValue', value);
});
</script>
