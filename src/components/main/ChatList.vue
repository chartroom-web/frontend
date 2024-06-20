<template>
  <aside class="w-1/4 bg-white p-4 shadow-lg">
    <div class="mb-4">
      <input
        type="text"
        placeholder="Search"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
    <div class="overflow-auto h-full">
      <template v-if="chats.length">
        <div
          v-for="chat in chats"
          :key="chat.id"
          class="relative p-2 mb-2 bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-200 rounded-lg shadow-sm"
          @click="selectChat(chat.id)"
        >
          <div class="flex items-center">
            <div v-if="chat.avatar" class="w-10 h-10 rounded-full mr-3">
              <img :src="chat.avatar" alt="avatar" class="w-full h-full rounded-full" />
            </div>
            <div v-else class="w-10 h-10 rounded-full mr-3">
              <a-avatar class="w-full h-full">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
            <div>
              <h3 class="font-semibold">{{ chat.name }}</h3>
              <div class="text-gray-500 text-sm truncate my-1">
                {{ formattedLastMessage(chat.lastMessage) }}
              </div>
            </div>
          </div>
          <!-- Red dot for unread messages -->
          <div v-if="chat.unread" class="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </template>
      <template v-else>
        <div class="flex items-center justify-center h-full">
          <p class="text-gray-500">No chats available</p>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  chats: Array,
});
const emit = defineEmits(['selectChat']);

const formattedLastMessage = (message) => {
  if (message.length <= 10) {
    return message;
  } else {
    return message.slice(0, 7) + '...';
  }
};

const selectChat = (id) => {
  props.chats.find((chat) => chat.id === id).unread = false;
  emit('selectChat', id);
};
</script>

<style scoped>
input:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
