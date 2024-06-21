<template>
  <div>
    <DynamicForm
      :fields="fields"
      buttonText="Login"
      linkText="還未註冊?點此建立"
      linkTo="/register"
      :linkClass="errorMsgClass"
      :googleButton="true"
      @button-click="emailSignIn"
      @google-sign-in="googleSignIn"
    >
      <template #header> Sign in to start your session </template>
      <template #link>
        {{ errorMsg }}
      </template>
    </DynamicForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicForm from '@/components/cover/DynamicForm.vue'
import { mail_login } from '@/functions/auth'

let errorMsgClass = ref(null)
let errorMsg = ref('')

const fields = ref([
  {
    id: 'email',
    name: 'email',
    type: 'text',
    placeholder: 'email',
    value: ''
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    value: ''
  }
])

const emailSignIn = async () => {
  errorMsgClass.value = 'text-red-500'
  const data = fields.value.reduce((result, field) => {
    result[field.id] = field.value
    return result
  }, {})
  if (!data.email || !data.password) {
    errorMsg.value = 'All fields are required'
    return
  }
  const res = await mail_login(data.email, data.password)

  if (res.status === 200) {
    errorMsg.value = ''
    errorMsgClass.value = 'text-green-500'
    errorMsg.value = 'Login success'
    window.location.href = '/home'
  } else {
    errorMsg.value = 'Login failed'
  }
}

const googleSignIn = () => {
  console.log('google sign in')
  window.location.href = `http://${process.env.VITE_BACKEND}/auth/google_login`
}
</script>
