<template>
  <div>
    <ForgotPasswordForm
      v-if="showForgotPassword"
      @password-reset="showForgotPassword = false"
      @back-to-login="showForgotPassword = false"
    />
    <LoginForm
      v-else-if="!challengedUser"
      @new-password-required="handleNewPasswordRequired"
      @forgot-password="showForgotPassword = true"
    />
    <UpdatePasswordForm v-else :challengedUser="challengedUser" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoginForm from './LoginForm.vue';
import UpdatePasswordForm from './UpdatePasswordForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import { CognitoUser } from 'amazon-cognito-identity-js';

export default defineComponent({
  name: 'AuthForm',
  components: {
    LoginForm,
    UpdatePasswordForm,
    ForgotPasswordForm,
  },
  setup() {
    const challengedUser = ref<CognitoUser | null>(null);
    const showForgotPassword = ref(false);

    const handleNewPasswordRequired = (user: CognitoUser) => {
      challengedUser.value = user;
    };

    return {
      challengedUser,
      showForgotPassword,
      handleNewPasswordRequired,
    };
  },
});
</script>

<style scoped>
</style>
