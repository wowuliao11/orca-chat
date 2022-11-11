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
              <div>{{ props.row.title }}</div>
            </q-card-section>

            <q-separator />
            <!-- Describe -->
            <q-card-section>
              <strong>Describe</strong>
              <div>{{ props.row.describe }}</div>
            </q-card-section>

            <q-card-section>
              <q-btn
                color="primary"
                icon="las la-users"
                label="Let's talk!"
                :to="'/room/' + props.row._id"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import PhotoSwiper from 'components/PhotoSwiper.vue';

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
  rows.value = result.data.payload?.data;
  pagination.value = {
    ...pagination.value,
    rowsNumber: result.data.payload?.count,
  };

  console.log(result);
};

load();
</script>
