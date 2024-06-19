<template>
  <div class="flex h-screen bg-gray-200 overflow-hidden">
    <aside class="w-1/4 bg-white p-4 shadow-lg">
      <div class="mb-4">
        <input
          type="text"
          placeholder="Search"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div class="overflow-auto h-full">
        <div
          v-for="chat in chats"
          :key="chat.id"
          class="p-2 mb-2 bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-200 rounded-lg shadow-sm"
          @click="selectChat(chat.id)"
        >
          <div class="flex items-center">
            <img :src="chat.avatar" alt="avatar" class="w-10 h-10 rounded-full mr-3" />
            <div>
              <h3 class="font-semibold">{{ chat.name }}</h3>
              <p class="text-gray-500 text-sm truncate">{{ chat.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <main v-if="selectChat" class="w-3/4 flex flex-col">
      <header class="bg-white p-4 shadow-lg flex items-center">
        <img :src="selectedChat.avatar" alt="avatar" class="w-10 h-10 rounded-full mr-3" />
        <h2 class="font-semibold text-lg">{{ selectedChat.name }}</h2>
      </header>
      <div class="flex-1 p-4 overflow-auto bg-gray-100">
        <div v-for="message in selectedChat.messages" :key="message.id" class="mb-4">
          <div :class="{ 'text-right': message.sender === 'me' }">
            <div
              :class="[
                'inline-block px-4 py-2 rounded-lg',
                message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white shadow'
              ]"
            >
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>
      <footer v-if="selectedChat" class="bg-white p-4 shadow-lg flex items-center">
        <a-textarea
          id="textarea"
          v-model:value="messageText"
          placeholder="Type a message"
          :auto-size="{ minRows: 1, maxRows: 5 }"
        />
        <!-- <textarea
          v-model="messageText"
          placeholder="Type a message"
          class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 resize-none"
          rows="1"
          @keydown.enter="sendMessage"
        ></textarea> -->
        <div class="mx-2">
          <V3Emoji @click-emoji="appendEmoji" />
        </div>
        <button
          @click="sendMessage"
          class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Send
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import createWebSocket from "@/functions/websocket";

const ws = createWebSocket(`ws://${import.meta.env.VITE_BACKEND}`);

const chats = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Hello!',
    messages: [
      { id: 1, text: 'Hello!', sender: 'John Doe' },
      { id: 2, text: 'Hi, how are you?', sender: 'me' }
    ]
  }
  // 更多聊天数据
])

onMounted(() => {
  selectChat(1)
  online()
})

const selectedChatId = ref(1)
const messageText = ref('')

const online = () => {
  let data = {
    type: 'online',
    username: 'John Doe',
    userid: 1
  }
  ws.send(JSON.stringify(data));
}

const selectedChat = computed(() => {
  return chats.value.find((chat) => chat.id === selectedChatId.value) || chats.value[0]
})

const selectChat = (id) => {
  selectedChatId.value = id
}

const sendMessage = () => {
  if (messageText.value.trim()) {
    selectedChat.value.messages.push({ id: Date.now(), text: messageText.value, sender: 'me' })
    ws.send(JSON.stringify(messageText.value.trim()));
    messageText.value = ''
  }
}

const appendEmoji = (emoji) => {
  const myField = document.querySelector('#textarea')
  if (myField.selectionStart || myField.selectionStart === 0) {
      var startPos = myField.selectionStart
      var endPos = myField.selectionEnd
      console.log(startPos, endPos)
      myField.value = myField.value.substring(0, startPos) + emoji + myField.value.substring(endPos, myField.value.length)
      myField.selectionStart = startPos + 1
      myField.selectionEnd = startPos + 1
  } else {
    myField.value += emoji
  }
  console.log(myField.value)
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
}

input:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}
</style>

<!-- <template>
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

</script> -->
