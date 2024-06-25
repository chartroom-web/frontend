<template>
  <div class="flex justify-center items-center h-screen">
    <DynamicForm
      :fields="fields"
      buttonText="start"
      :linkClass="errorMsgClass"
      :googleButton="false"
      @button-click="quickstart"
      class="border-2 border-gray-400 rounded-lg shadow-lg p-4 bg-slate-200"
    >
      <template #header> Qickstart into chatroom </template>
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
import { temp_register } from '@/functions/auth'

let errorMsgClass = ref(null)
let errorMsg = ref('')

const fields = ref([
  {
    id: 'name',
    name: 'name',
    type: 'text',
    placeholder: 'name',
    value: ''
  }
])

const quickstart = async () => {
  const name = fields.value[0].value
  if (name === '') {
    errorMsg.value = 'Please enter your name'
    errorMsgClass.value = 'text-red-500'
    return
  }
  const res = await temp_register(name)
  console.log(res)
  if (res.status === 200) {
    window.location.href = '/home'
  } else {
    errorMsg.value = 'Something went wrong'
    errorMsgClass.value = 'text-red-500'
  }
}
</script>
