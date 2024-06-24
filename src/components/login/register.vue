<template>
  <div class="h-full flex justify-center items-center bg-white">
    <DynamicForm
      :fields="fields"
      buttonText="Register"
      linkText="已經註冊?點此登入"
      linkTo="/login"
      :linkClass="errorMsgClass"
      @button-click="RegisterHandler"
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
  console.log(response)
  if (errorMsg.value !== '') {
    return
  }
}
</script>
