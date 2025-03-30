<template>
  <div>
    <LoginForm
      v-if="!challengedUser"
      @new-password-required="handleNewPasswordRequired"
    />
    <UpdatePasswordForm v-else :challengedUser="challengedUser" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoginForm from './LoginForm.vue';
import UpdatePasswordForm from './UpdatePasswordForm.vue';
import { CognitoUser } from 'amazon-cognito-identity-js';

export default defineComponent({
  name: 'AuthForm',
  components: {
    LoginForm,
    UpdatePasswordForm,
  },
  setup() {
    const challengedUser = ref<CognitoUser | null>(null);

    const handleNewPasswordRequired = (user: CognitoUser) => {
      challengedUser.value = user;
    };

    return {
      challengedUser,
      handleNewPasswordRequired,
    };
  },
});
</script>

<style scoped>
</style>
