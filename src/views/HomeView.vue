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
        <template v-if="chats.length">
          <div
            v-for="chat in chats"
            :key="chat.id"
            class="p-2 mb-2 bg-white hover:bg-gray-100 cursor-pointer transition-colors duration-200 rounded-lg shadow-sm"
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
          </div>
        </template>
        <template v-else>
          <div class="flex items-center justify-center h-full">
            <p class="text-gray-500">No chats available</p>
          </div>
        </template>
      </div>
    </aside>
    <template v-if="chats.length">
      <main v-if="selectChat" class="w-3/4 flex flex-col">
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
          <div v-for="message in selectedChat.messages" :key="message.id" class="mb-4 flex">
            <div v-if="message.sender !== 'me'" class="w-10 h-10 rounded-full mr-3">
              <div v-if="selectedChat.avatar">
                <img :src="selectedChat.avatar" alt="avatar" class="w-full h-full rounded-full" />
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
              <div
                :class="[
                  'inline-block px-4 py-2 rounded-lg',
                  message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white shadow'
                ]"
              >
                <p v-if="message.text" class="whitespace-pre-wrap">{{ message.text }}</p>
                <img v-if="message.image" :src="message.image" class="mt-2 rounded-lg max-w-xs bg-transparent"/>
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
        <footer
          v-if="selectedChat"
          class="bg-white p-4 shadow-lg flex items-center"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <div v-if="previewImages.length" class="flex mb-2">
            <img
              v-for="(image, index) in previewImages"
              :key="index"
              :src="image"
              class="w-20 h-20 object-cover rounded-lg mr-2"
            />
          </div>
          <a-textarea
            id="textarea"
            v-model:value="messageText"
            placeholder="Type a message"
            :auto-size="{ minRows: 1, maxRows: 5 }"
            @keydown.enter="handleEnter"
          />
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
    </template>
    <template v-else>
      <main class="w-3/4 flex items-center justify-center">
        <p class="text-gray-500">No chats available</p>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import createWebSocket from '@/functions/websocket'
import { me } from '@/functions/auth'
import { UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const ws = createWebSocket(`ws://${import.meta.env.VITE_BACKEND}`)
let meState = ref(null)

onMounted(async () => {
  selectChat(1)
  meState.value = await me()
  online(meState.value)
})

const online = (user) => {
  let data = {
    type: 'online',
    ...user
  }
  ws.send(JSON.stringify(data))
}

const handleEnter = (event) => {
  if (event.shiftKey) {
    return
  }

  event.preventDefault()
  sendMessage()
}

ws.onmessage = (event) => {
  let data = JSON.parse(event.data)
  if (data.type === 'online') {
    ws.send(
      JSON.stringify({
        type: 'getonline'
      })
    )
  } else if (data.type === 'getonline') {
    // problem
    chats.value = chats.value.filter((chat) =>
      data.usersMemberList.some((user) => user.id === chat.id)
    )
    data.usersMemberList.forEach((user) => {
      if (user.id === meState.value.id) return
      if (chats.value.find((chat) => chat.id === user.id)) return
      chats.value.push({
        id: user.id,
        name: user.username,
        avatar: user.picture,
        lastMessage: '',
        messages: []
      })
    })
  } else if (data.type === 'message') {
    console.log(data)
    let chat = chats.value.find((chat) => chat.id === data.from)
    chat.messages.push({
      id: Date.now(),
      text: data.text,
      sender: data.username,
      image: data.image,
      timestamp: data.timestamp
    })
    chat.lastMessage = data.text
    console.log(chats.value)
  }
}

const selectedChatId = ref(1)
const messageText = ref('')
const chats = ref([])
const previewImages = ref([])

const selectedChat = computed(() => {
  return chats.value.find((chat) => chat.id === selectedChatId.value) || chats.value[0]
})

const selectChat = (id) => {
  selectedChatId.value = id
}

const sendMessage = () => {
  if (selectedChat.value) {
    const trimmedMessage = messageText.value.trim()
    const images = previewImages.value

    if (trimmedMessage || images.length) {
      const message = {
        id: Date.now(),
        text: trimmedMessage,
        image: null,
        sender: 'me',
        timestamp: new Date().toISOString()
      }
      if (images.length) {
        message.image = images
      }
      ws.send(
        JSON.stringify({
          type: 'message',
          to: selectedChat.value.id,
          from: meState.value.id,
          image: message.image,
          text: messageText.value.trim(),
          timestamp: new Date().toISOString()
        })
      )
      selectedChat.value.messages.push(message)
      selectedChat.value.lastMessage = trimmedMessage
      messageText.value = ''
      previewImages.value = []
    }
  }
}

const appendEmoji = (emoji) => {
  const myField = document.querySelector('#textarea')
  if (myField.selectionStart || myField.selectionStart === 0) {
    var startPos = myField.selectionStart
    var endPos = myField.selectionEnd
    console.log(startPos, endPos)
    myField.value =
      myField.value.substring(0, startPos) +
      emoji +
      myField.value.substring(endPos, myField.value.length)
    myField.selectionStart = startPos + 1
    myField.selectionEnd = startPos + 1
  } else {
    myField.value += emoji
  }
  console.log(myField.value)
}

const formattedLastMessage = (message) => {
  if (message.length <= 10) {
    return message
  } else {
    return message.slice(0, 7) + '...'
  }
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
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
