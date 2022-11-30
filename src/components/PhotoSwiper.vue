<template>
  <div class="row q-col-gutter-md">
    <div
      :id="galleryID"
      v-for="(image, index) in imagesData"
      :key="index"
      class="col-4"
    >
      <a
        ref="aref"
        :key="index"
        :href="image.url"
        :data-pswp-width="image.width"
        :data-pswp-height="image.height"
        data-pswp-tile-type="deepzoom"
        target="_blank"
        rel="noreferrer"
      >
        <q-img
          :src="
            isThumb ? image.url.replace(/\/([^\/]*)$/, '/thumb/$1') : image.url
          "
          style="max-width: 200px; max-height: 200px"
        />
      </a>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import PhotoSwipeLightbox from 'photoswipe/lightbox';

import 'photoswipe/style.css';

export default defineComponent({
  name: 'PhotoswipeComponent',
  emits: ['fileDelete'],
  props: {
    galleryID: String,
    images: Array,
    thumb: Boolean,
  },
  data: function () {
    return { aref: [] };
  },
  setup(props) {
    const imagesData = ref([]);

    const isThumb = ref(props.thumb);

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

    return {
      imagesData,
      isThumb,
    };
  },
  mounted() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: '#' + this.$props.galleryID,
        children: 'a',
        showHideAnimationType: 'zoom',
        pswpModule: () => import('photoswipe'),
        initialZoomLevel: 'fill',
        secondaryZoomLevel: 'fit',
        wheelToZoom: true,
        zoom: false,
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
