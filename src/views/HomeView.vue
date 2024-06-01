<template>
  <div>
    {{ message }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { me } from '@/functions/auth'

let message = ref(null)
onMounted(async() => {
  message.value = await me();
})

</script>