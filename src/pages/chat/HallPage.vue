<template>
  <div class="q-pa-md">
    <q-table
      grid
      :rows="rows"
      :columns="columns"
      row-key="_id"
      hide-header
      v-model:pagination="pagination"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section>
              <PhotoSwiper
                :gallery-i-d="props.row.title"
                :images="[props.row.avatar]"
              />
            </q-card-section>

            <!-- Title -->
            <q-card-section>
              <strong>Title</strong>
              <div class="harmony-font-sans-light">{{ props.row.title }}</div>
            </q-card-section>

            <q-separator />
            <!-- Describe -->
            <q-card-section>
              <strong>Describe</strong>
              <div class="harmony-font-sans-light">
                {{ props.row.describe }}
              </div>
            </q-card-section>

            <q-card-section class="q-gutter-md">
              <q-btn
                color="primary"
                icon="las la-users"
                label="Let's talk!"
                :to="'/room/' + props.row.title"
                v-if="props.row.memberUserIds?.some((m:any)=>m === userInfo.id)"
              />

              <q-btn
                color="primary"
                icon="las la-running"
                label="Leave"
                @click="onLeave(props.row.title)"
                v-if="props.row.memberUserIds?.some((m:any)=>m === userInfo.id)"
              />
              <q-btn
                color="primary"
                icon="group_add"
                label="JOIN"
                v-else
                @click="onJoin(props.row.title)"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { userInfoStore } from 'stores/user-info-store';
import PhotoSwiper from 'components/PhotoSwiper.vue';

const $q = useQuasar();

const userInfo = userInfoStore();

const rows = ref([]);

const pagination = ref<QTableProps['pagination']>({
  sortBy: '',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns = ref<QTableProps['columns']>([
  { name: 'title', label: 'title', field: 'title' },
  {
    name: 'describe',
    label: 'describe',
    field: 'describe',
  },
  { name: 'avatar', field: 'avatar', label: 'avatar' },
]);

const load = async () => {
  const { page, rowsPerPage } = pagination.value!;
  const result = await api.get('/room', {
    params: { pageIndex: page, pageSize: rowsPerPage },
  });
  const { count, data } = result.data.payload;

  for (const d of data) {
    d.memberUserIds = d.members.map((m: any) => m?.user?._id);
  }
  data.memberUserIds = data.reduce(
    (prev: any, cur: any) => [...prev, ...cur.members?.map((m: any) => m?._id)],
    []
  );
  rows.value = data;
  pagination.value = {
    ...pagination.value,
    rowsNumber: count,
  };
};

const onLeave = async (roomTitle: string) => {
  await api.patch('/room/leaveRoom', { roomTitle });
  $q.notify({ type: 'positive', message: 'Success leave!' });
  load();
};

const onJoin = async (roomTitle: string) => {
  await api.patch('/room/joinRoom', { roomTitle });
  $q.notify({ type: 'positive', message: 'Success join!' });
  load();
};

load();
</script>
