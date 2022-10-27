<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :breakpoint="400">
      <q-scroll-area
        :style="` height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;`"
      >
        <q-list padding>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top cursor-pointer"
        v-ripple
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
        @click="$router.replace({ path: '/editUser' })"
      >
        <div class="absolute-bottom bg-transparent">
          <q-btn round>
            <q-avatar>
              <q-img
                :src="userInfo.avatar || globalConfig.defaultAvatarUrl"
                alt="auto"
              />
            </q-avatar>
          </q-btn>
          <div class="text-weight-bold">
            {{ userInfo.username }}
          </div>
          <div>
            {{ userInfo.email }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { userInfoStore } from 'stores/user-info-store';
import { globalConfigStore } from 'stores/global-config-store';

const userInfo = userInfoStore();
const globalConfig = globalConfigStore();

const essentialLinks = [
  {
    title: '🐳',
    caption: 'room',
    icon: 'school',
    link: '/room',
  },
];
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
