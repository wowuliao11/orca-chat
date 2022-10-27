<template>
  <div :id="galleryID">
    <q-list separator>
      <q-item v-for="(image, index) in imagesData" :key="index">
        <q-item-section>
          <q-item-label class="full-width ellipsis" caption>
            {{ image.width }}x{{ image.height }}
          </q-item-label>
        </q-item-section>

        <q-item-section v-if="image.url" thumbnail class="gt-xs">
          <a
            ref="aref"
            :key="index"
            :href="image.url"
            :data-pswp-width="image.width"
            :data-pswp-height="image.height"
            target="_blank"
            rel="noreferrer"
          >
            <img :src="image.url.replace(/\/([^\/]*)$/, '/thumb/$1')" />
          </a>
        </q-item-section>

        <q-item-section top side>
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click="$emit('fileDelete', image.url)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from 'vue';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default defineComponent({
  name: 'PhotoswipeComponent',
  emits: ['fileDelete'],
  props: {
    galleryID: String,
    images: Array,
  },
  data: function () {
    return { aref: [] };
  },

  setup(props) {
    const imagesData = ref([]);
    const load = () => {
      {
        imagesData.value = [];
        for (let i = 0; i < props.images.length; ++i) {
          const img = new Image();
          img.src = props.images[i];
          imagesData.value[i] = {
            url: img.src,
            width: img.width,
            height: img.height,
          };
          img.onload = () => {
            imagesData.value[i] = {
              url: img.src,
              width: img.width,
              height: img.height,
            };
          };
        }
      }
    };
    load();
    watch(props.images, () => load());

    return {
      imagesData,
    };
  },
  mounted() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: '#' + this.$props.galleryID,
        children: 'a',
        maxWidthToAnimate: 800,
        showHideAnimationType: 'fade',
        pswpModule: () => import('photoswipe'),
      });

      this.lightbox.init();
    }
  },
  unmounted() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  },
});
</script>
