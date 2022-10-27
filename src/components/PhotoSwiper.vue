<template>
  <div :id="galleryID">
    <a
      ref="aref"
      v-for="(image, key) in imagesData"
      :key="key"
      :href="image.url"
      :data-pswp-width="image.width"
      :data-pswp-height="image.height"
      target="_blank"
      rel="noreferrer"
    >
      <img :src="image.url.replace(/\/([^\/]*)$/, '/thumb/$1')" alt="" />
    </a>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from 'vue';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default defineComponent({
  name: 'PhotoswipeComponent',

  props: {
    galleryID: String,
    images: Array,
  },
  data: function () {
    return { aref: [] };
  },

  setup(props) {
    const imagesData = ref([]);
    watch(props.images, (value) => {
      console.log(value, 'change!');

      for (let i = 0; i < value.length; ++i) {
        const img = new Image();
        img.src = value[i];
        img.onload = () => {
          console.log(img.width, img.height);
          imagesData.value[i] = {
            url: img.src,
            width: img.width,
            height: img.height,
          };
        };
      }
    });

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
