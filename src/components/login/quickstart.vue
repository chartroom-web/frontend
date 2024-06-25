<template>
  <div class="h-full flex justify-center items-center bg-white">
    <DynamicForm
      :fields="fields"
      buttonText="start"
      :linkClass="errorMsgClass"
      @button-click="emailSignIn"
      @google-sign-in="googleSignIn"
      class="shadow-none"
    >
      <template #header> enter name and quick start </template>
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

const fields = ref([
  {
    id: 'name',
    name: 'name',
    type: 'text',
    placeholder: 'name',
    value: ''
  }
])
</script>
