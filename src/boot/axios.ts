import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_BASE_URL });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.request.use((value) => {
    return value;
  });

  api.interceptors.response.use(
    (value) => {
      const { data } = value;

      switch (data.code) {
        case 1:
          Notify.create({ type: 'negative', message: data.message });
      }

      return value;
    },
    (error) => {
      const { status, data } = error.response;
      const { errMsg } = data?.payload;

      switch (status) {
        case 400:
          Notify.create({
            type: 'negative',
            message: errMsg,
          });

          break;
        default:
          Notify.create({
            type: 'warning',
            message: errMsg,
          });
          break;
      }
      return Promise.reject(error);
    }
  );
});

export { api };
