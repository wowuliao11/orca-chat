<template>
  <q-page-container>
    <q-page
      class="q-pa-md bg-image window-height window-width row justify-center items-center"
    >
      <div class="column col-8">
        <div class="row justify-center">
          <h5 class="text-h3 text-black q-my-md">🐳</h5>
        </div>

        <div class="row justify-center">
          <div class="col-lg-3">
            <q-card square class="q-pa-lg">
              <q-form class="q-gutter-md" @submit="onLogin">
                <q-card-section>
                  <q-input
                    square
                    filled
                    v-model="loginForm.loginKey"
                    label="Username || Email"
                    :rules="[
                      (val) =>
                        rules.isEmail(val) ||
                        val.length > 6 ||
                        'Field must a valid email or string length more than 6',
                    ]"
                  />
                  <q-input
                    square
                    filled
                    v-model="loginForm.password"
                    :type="isPwd ? 'password' : 'text'"
                    label="password"
                    :rules="[
                      (val) =>
                        (val.length >= 6 && val.length <= 16) ||
                        'Password length should between 6 and 16!',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-actions class="q-px-md">
                  <q-btn
                    unelevated
                    color="light-green-7"
                    size="lg"
                    class="full-width"
                    label="Sign In"
                    type="submit"
                  />
                </q-card-actions>

                <q-card-section class="q-px-md">
                  <q-btn
                    label="Sign Up"
                    color="primary"
                    class="full-width"
                    size="lg"
                    @click="card = true"
                  />
                </q-card-section>
              </q-form>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
  <q-dialog v-model="card" persistent>
    <q-card>
      <q-form @submit="onRegist">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Register📃</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          You'll get a verification code in your email. All you have to do is
          copy it, and we'll know you're one of us😄.
        </q-card-section>
        <q-card-section>
          <q-input
            standout="bg-teal text-white"
            v-model="registerForm.username"
            label="Username"
            :rules="[
              (val) =>
                (val.length >= 6 && val.length <= 16) ||
                'Username length should between 6 and 16!',
            ]"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            standout="bg-teal text-white"
            v-model="registerForm.email"
            label="Email✉️"
            lazy-rules
            error-message="Field must a valid email"
            @update:model-value="onEmailChange"
            :error="!isEmailValid"
            :rules="
            [(value:string) => value.length>0 && rules.isEmail(value) || 'Field must a valid email']
          "
          >
            <template v-slot:after>
              <q-btn
                v-if="sendMailCountDownCount === 0"
                icon="las la-paper-plane"
                @click="onSendMail"
                style="width: 40px"
                standout="bg-teal text-white"
                dense
              />
              <q-btn v-else disable dense style="width: 40px">
                {{ sendMailCountDownCount }}
              </q-btn>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="registerForm.verificationCode"
            standout="bg-teal text-white"
            label="Verification Code"
            :rules="[
              (val) => val.length > 0 || 'Verification Code couldn\'t be empty',
            ]"
          />
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="registerForm.password"
            standout="bg-teal text-white"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) =>
                (val.length >= 6 && val.length <= 16) ||
                'Password length should between 6 and 16!',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section align="center">
          <q-btn size="lg" type="submit"> Sign Up </q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import rules from '@utils/rules';
import { api } from 'src/boot/axios';
import { LocalStorage, useQuasar } from 'quasar';
import { userInfoStore } from 'stores/user-info-store';

const userStore = userInfoStore();

const $q = useQuasar();

const isEmailValid = ref(true);

const registerForm = ref<{
  username: string;
  password: string;
  email: string;
  verificationCode: string;
}>({
  username: '',
  password: '',
  email: '',
  verificationCode: '',
});

const loginForm = ref<{ loginKey: string; password: string }>({
  loginKey: '',
  password: '',
});

const card = ref(false); // 卡片开关

const sendMailCountDownCount = ref(0); // 倒计时

const isPwd = ref(true); // 密码可见开关

const onSendMail = async () => {
  if (!registerForm.value.email || !rules.isEmail(registerForm.value.email)) {
    isEmailValid.value = false;
    return;
  }
  await api.post('/mail/verificationCode', {
    to: registerForm.value.email,
  });

  sendMailCountDownCount.value = 60;

  const countDownInterval = setInterval(() => {
    sendMailCountDownCount.value -= 1;
    if (sendMailCountDownCount.value === 0) clearInterval(countDownInterval);
  }, 1000);
};

const onRegist = async () => {
  await api.post('/user', {
    ...registerForm.value,
  });
  $q.notify({ type: 'positive', message: 'Success regist' });
  card.value = false;
};

const onEmailChange = async () => {
  if (rules.isEmail(registerForm.value.email)) isEmailValid.value = true;
  else isEmailValid.value = false;
};

const onLogin = async () => {
  const data = await api.post('/auth/login', loginForm.value);

  const { username, id, roles, access_token, email, avatar } =
    data.data.payload;

  userStore.updateInfo({ username, id, roles, email, avatar });
  LocalStorage.set('O-TOKEN', access_token); // 存入storage

  window.location.hash = '/home';

  $q.notify({ type: 'positive', message: 'Success Login!' });
};
</script>
