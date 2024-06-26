<template>
  <div class="whitespace-pre-wrap flex justify-center items-center h-screen">
    <DynamicForm
      :fields="fields"
      buttonText="Register"
      linkText="已經註冊?點此登入"
      linkTo="/login"
      :linkClass="errorMsgClass"
      @button-click="RegisterHandler"
      class="border-2 border-gray-400 rounded-lg shadow-lg p-4 bg-slate-200"
    >
      <template #header> Register to start your session </template>
      <template #link>
        {{ errorMsg }}
      </template>
    </DynamicForm>
  </div>
</template>

<script setup lang="ts">
import DynamicForm from '@/components/cover/DynamicForm.vue'
import { register } from '@/functions/auth'
import { ref } from 'vue'
import * as yup from 'yup'

const mailSchema = yup.string().email().required()
let errorMsg = ref('')
let errorMsgClass = ref('text-red-500')

const fields = ref([
  {
    id: 'username',
    name: 'username',
    type: 'text',
    placeholder: 'Username',
    value: ''
  },
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
  },
  {
    id: 'confirmPassword',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm Password',
    value: ''
  }
])

const RegisterHandler = async () => {
  errorMsg.value = ''
  const data = fields.value.reduce((result: any, field) => {
    result[field.id] = field.value.trim()
    return result
  }, {})
  errorMsgClass.value = 'text-red-500'
  if (!data.username || !data.email || !data.password || !data.confirmPassword) {
    errorMsg.value = 'All fields are required'
    return
  }
  if (!mailSchema.isValidSync(data.email)) {
    errorMsg.value = 'Invalid email'
    return
  }
  if (data.password !== data.confirmPassword) {
    errorMsg.value = 'Passwords do not match'
    return
  }
  const response = await register(data.username, data.email, data.password)
  alert('註冊成功 驗證信將在 5 分鐘內寄往您的信箱 請至信箱點擊驗證信')
  console.log(response)
  if (errorMsg.value !== '') {
    return
  }
}
</script>
