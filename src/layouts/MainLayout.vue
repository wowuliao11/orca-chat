<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-gutter-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> 🐳 💬</q-toolbar-title>

        <div>I use Quasar v{{ $q.version }} 👍</div>
        <q-separator dark vertical />

        <q-btn icon="las la-door-open" stretch flat @click="logout" />
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
        src="~assets/edbg.jpeg"
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
            {{ userInfo.nick }}
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
import { LocalStorage, useQuasar } from 'quasar';

const $q = useQuasar();

const userInfo = userInfoStore();
const globalConfig = globalConfigStore();

const essentialLinks = [
  {
    title: 'Chat room🏠',
    caption: 'Some room for chat',
    icon: 'forum',
    link: '/hall',
  },
];
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  userInfo.logOut();
  LocalStorage.clear();
  window.location.hash = '/login';
  $q.notify({ type: 'positive', message: 'See you soon!' });
};
</script>
