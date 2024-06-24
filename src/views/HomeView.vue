<template>
  <div class="flex h-screen bg-gray-200 overflow-hidden">
    <ChatList :chats="chats" @selectChat="selectChat" />
    <ChatWindow :selectedChat="selectedChat" :meState="meState" @sendMessage="sendMessage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import createWebSocket from '@/functions/websocket'
import { me } from '@/functions/auth'
import ChatList from '@/components/main/ChatList.vue'
import ChatWindow from '@/components/main/ChatWindow.vue'

const ws = createWebSocket(`ws://${import.meta.env.VITE_BACKEND}`)
let meState = ref(null)

onMounted(async () => {
  meState.value = await me()
  console.log(meState.value)
  online(meState.value)
})

const online = (user) => {
  let data = {
    type: 'online',
    ...user
  }
  ws.send(JSON.stringify(data))
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
    chats.value = chats.value.filter((chat) => {
      if (chat.id === -1) {
        return true
      }
      data.usersMemberList.some((user) => user.id === chat.id)
    })
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
    // 應付多點登陸
    console.log(data)
    let chat = null
    if (data.from === meState.value.id) {
      chat = chats.value.find((chat) => chat.id === data.to)
      console.log(chats.value, chat)
      chat.messages.push({
        id: Date.now(),
        text: data.text,
        isAnnouncement: data.isAnnouncement,
        sender: 'me',
        image: data.image,
        timestamp: data.timestamp
      })
    } else {
      if (data.to === -1) {
        chat = chats.value.find((chat) => chat.id === -1)
      } else {
        chat = chats.value.find((chat) => chat.id === data.from)
      }
      // console.log(chats.value)
      // console.log(chats.value.find((chat) => chat.id === data.from))
      // console.log(chats.value.find((chat) => chat.id === data.from).avatar)
      console.log(data)
      chat.messages.push({
        id: Date.now(),
        avatar: data.to === -1 ? null : chats.value.find((chat) => chat.id === data.from).avatar,
        text: data.text,
        isAnnouncement: data.isAnnouncement,
        sender: data.sender.username,
        image: data.image,
        timestamp: data.timestamp
      })
    }
    console.log(selectedChatId.value, chat.id)
    if (selectedChatId.value !== chat.id) chat.unread = true
    chat.lastMessage = data.text
  }
}

const selectedChatId = ref(-1)
const chats = ref([
  {
    id: -1,
    name: 'Group',
    avatar: null,
    lastMessage: '',
    messages: []
  }
])
const selectedChat = computed(() => {
  return chats.value.find((chat) => chat.id === selectedChatId.value) || chats.value[0]
})

const selectChat = (id) => {
  selectedChatId.value = id
}

const sendMessage = (message) => {
  if (selectedChat.value) {
    ws.send(
      JSON.stringify({
        type: 'message',
        isAnnouncement: false,
        to: selectedChat.value.id,
        from: meState.value.id,
        image: message.image,
        text: message.text,
        timestamp: new Date().toISOString()
      })
    )
  }
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
}
</style>
