<template>
  <main v-if="selectedChat" class="w-3/4 flex flex-col">
    <header class="bg-white p-4 shadow-lg flex items-center">
      <div v-if="selectedChat.avatar" class="w-10 h-10 rounded-full mr-3">
        <img :src="selectedChat.avatar" alt="avatar" class="w-full h-full rounded-full" />
      </div>
      <div v-else class="w-10 h-10 rounded-full mr-3">
        <a-avatar class="w-full h-full">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>
      <h2 class="font-semibold text-lg">{{ selectedChat.name }}</h2>
    </header>
    <div class="flex-1 p-4 overflow-auto bg-gray-100">
      <div v-for="message in selectedChat.messages" :key="message.id" class="mb-4">
        <div v-if="message.isAnnouncement" class="w-full text-center text-gray-500">
          {{ message.text }}
        </div>
        <div v-else class="flex">
          <div v-if="message.sender !== 'me'" class="w-10 h-10 rounded-full mr-3">
            <div v-if="message.avatar">
              <img :src="message.avatar" alt="avatar" class="w-full h-full rounded-full" />
            </div>
            <div
              v-else
              class="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white text-xl"
            >
              <a-avatar class="w-full h-full">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
          </div>
          <div :class="{ 'text-right': message.sender === 'me', 'flex-1': true }">
            <div v-if="message.sender !== 'me'" class="text-gray-400 text-xs mb-1">
              {{ message.sender }}
            </div>
            <div
              :class="[
                'inline-block px-4 py-2 rounded-lg',
                message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white shadow'
              ]"
            >
              <p v-if="message.text" class="whitespace-pre-wrap">{{ message.text }}</p>
              <img
                v-if="message.image"
                :src="message.image"
                class="mt-2 rounded-lg max-w-xs bg-transparent"
              />
            </div>
            <div
              :class="{
                'text-right': message.sender === 'me',
                'text-left': message.sender !== 'me'
              }"
              class="text-gray-500 text-xs mt-1"
            >
              {{ new Date(message.timestamp).toLocaleTimeString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <MessageInput @sendMessage="handleSendMessage" />
  </main>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MessageInput from '@/components/main/MessageInput.vue'
import { UserOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  selectedChat: Object,
  meState: Object
})
const emit = defineEmits(['sendMessage'])

const handleSendMessage = (message) => {
  emit('sendMessage', message)
}
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
</style>
