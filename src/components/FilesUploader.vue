<template>
  <q-uploader
    :factory="factory"
    accept="image/*"
    :label="props.label || 'Image Uploader🌞'"
    multiple
    auto-upload
    @uploaded="onUploaded"
    hide-upload-btn
    :readonly="!!(props.maxFiles && images.length >= props.maxFiles)"
    :max-file-size="3072 * 1000"
    @failed="onFailed"
    @rejected="onRejected"
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
</template>

<script setup lang="ts">
import {
  LocalStorage,
  QList,
  QRejectedEntry,
  QUploader,
  QUploaderFactoryFn,
  QUploaderFactoryObject,
  useQuasar,
} from 'quasar';
import PhotoSiwiper from 'src/components/UploaderPhotoSwiper.vue';
import { ref, watch } from 'vue';

const $q = useQuasar();

const props = defineProps({ images: Array, label: String, maxFiles: Number });

const emit = defineEmits(['update:modelValue']);

const images = ref<any>([...(props.images || [])]);

emit('update:modelValue', props.images);

const factory: QUploaderFactoryFn = (files) => {
  console.log('type' + files[0].type);
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

const onFailed = (info: { files: readonly any[]; xhr: any }) => {
  const response = JSON.parse(info.xhr?.response || '');

  $q.notify({
    type: 'negative',
    message:
      'Failed reason:' +
      (response?.payload?.errMsg || 'Unknow reason for this failed'),
  });
};

const onRejected = (rejectedEntries: QRejectedEntry[]) => {
  $q.notify({
    type: 'negative',
    message:
      'Failed reason:' +
        rejectedEntries.map((r) => r.failedPropValidation).join(',') ||
      'Unknow reason for this failed',
  });
};
watch(images.value, (value) => {
  emit('update:modelValue', value);
});
</script>
